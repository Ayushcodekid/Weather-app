import React from 'react';

const AlertSystem = ({ data, threshold, setThreshold }) => {
  const latestAlert = data.find(item => parseFloat(item.temp) > threshold);

  return (
    <div className="alert-system">
      <h3>Alert System</h3>
      <div>
        <label htmlFor="threshold">Set Temperature Threshold (°C): </label>
        <input
          type="number"
          id="threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          style={{ marginLeft: '10px', width: '60px' }}
        />
      </div>
      {latestAlert ? (
        <p style={{ color: '#e57373' }}>
          ⚠️ Alert! Current temperature in {latestAlert.city} is 
          {latestAlert.temp} °C, exceeding the threshold of {threshold} °C!
        </p>
      ) : (
        <p>No alerts. All temperatures are within the safe range.</p>
      )}
    </div>
  );
};

export default AlertSystem;
