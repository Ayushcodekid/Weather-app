import React, { useState, useEffect } from 'react';

const CityTabs = ({ weatherData, dailySummary }) => {
  // Set activeTab to the first city's name or a default value if weatherData is empty
  const [activeTab, setActiveTab] = useState(weatherData.length > 0 ? weatherData[0].city : '');

  // Optional: Update the active tab if weatherData changes
  useEffect(() => {
    if (weatherData.length > 0) {
      setActiveTab(weatherData[0].city);
    }
  }, [weatherData]);

  const handleTabClick = (city) => {
    setActiveTab(city);
  };

  const getSummary = () => {
    const today = new Date().toLocaleDateString();
    return dailySummary[today] || {};
  };

  return (
    <div>
      <div className="tabs">
        {weatherData.map((data) => (
          <button
            key={data.city}
            className={`tab-button ${activeTab === data.city ? 'active' : ''}`}
            onClick={() => handleTabClick(data.city)}
          >
            {data.city}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {weatherData.map((data) => 
          activeTab === data.city && (
            <div key={data.city}>
              <h3>{data.city}</h3>
              <p>Temperature: {data.temp} °C</p>
              <p>Feels Like: {data.feels_like} °C</p>
              <p>Condition: {data.condition}</p>
              <p>Last Updated: {data.time}</p>
              <div className="daily-summary">
                <h4>Daily Summary:</h4>
                <p>Average Temp: {getSummary().averageTemp || 'N/A'} °C</p>
                <p>Max Temp: {getSummary().maxTemp || 'N/A'} °C</p>
                <p>Min Temp: {getSummary().minTemp || 'N/A'} °C</p>
                <p>Dominant Condition: {getSummary().dominantCondition || 'N/A'}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CityTabs;
