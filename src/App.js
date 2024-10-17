import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertSystem from './AlertSystem';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css'; // Import the CSS file
import CityTabs from './CityTabs'; // Import the CityTabs component
import 'bootstrap/dist/css/bootstrap.min.css';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [dailySummary, setDailySummary] = useState({});
  const [threshold, setThreshold] = useState(35); // Default threshold for alerts
  const API_KEY = '2947d02539dba6a9b9a01db597ab60b4';   // Replace with your OpenWeatherMap API key
  const INTERVAL = 300000; // 5 minutes in milliseconds

  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  const fetchWeatherData = async () => {
    const promises = cities.map(city => 
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    );

    const results = await Promise.all(promises);
    const formattedData = results.map(res => {
      const data = res.data;
      return {
        city: data.name,
        temp: kelvinToCelsius(data.main.temp),
        feels_like: kelvinToCelsius(data.main.feels_like),
        condition: data.weather[0].main,
        time: new Date(data.dt * 1000).toLocaleString()
      };
    });

    setWeatherData(formattedData);
    processDailySummary(formattedData);
  };

  const processDailySummary = (data) => {
    const today = new Date().toLocaleDateString();
    let summary = dailySummary[today] || { temps: [], conditions: [] }; // Initialize if not present

    data.forEach(item => {
      summary.temps.push(parseFloat(item.temp));
      summary.conditions.push(item.condition);
    });

    if (summary.temps.length > 0) {
      const averageTemp = (summary.temps.reduce((a, b) => a + b, 0) / summary.temps.length).toFixed(2);
      const maxTemp = Math.max(...summary.temps).toFixed(2);
      const minTemp = Math.min(...summary.temps).toFixed(2);
      const dominantCondition = getDominantCondition(summary.conditions);

      const newSummary = {
        ...dailySummary,
        [today]: {
          averageTemp,
          maxTemp,
          minTemp,
          dominantCondition
        }
      };

      setDailySummary(newSummary);
      localStorage.setItem('dailySummary', JSON.stringify(newSummary));
    }
  };

  const getDominantCondition = (conditions) => {
    return conditions.sort((a, b) =>
      conditions.filter(v => v === a).length
      - conditions.filter(v => v === b).length
    ).pop();
  };

  useEffect(() => {
    const savedSummary = JSON.parse(localStorage.getItem('dailySummary'));
    if (savedSummary) {
      setDailySummary(savedSummary);
    }
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Real-Time Weather Monitoring</h1>
      <CityTabs weatherData={weatherData} dailySummary={dailySummary} /> {/* Use CityTabs component */}
      <AlertSystem data={weatherData} threshold={threshold} setThreshold={setThreshold} />

      <h2>Weather Trends</h2>
      <LineChart width={800} height={400} data={Object.entries(dailySummary).map(([date, summary]) => ({ date, ...summary }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="averageTemp" stroke="#8884d8" />
        <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" />
        <Line type="monotone" dataKey="minTemp" stroke="#ff7300" />
      </LineChart>
    </div>
  );
};

export default App;
