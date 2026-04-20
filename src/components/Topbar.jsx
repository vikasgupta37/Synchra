import React, { useState, useEffect } from 'react';

/**
 * Topbar - Header status bar displaying real-time system indicators and live clock.
 */
function Topbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar" aria-label="Synchra system status header">
      <div
        className="status-indicators"
        role="status"
        aria-live="polite"
        aria-label="System status indicators"
      >
        <div className="status-item">
          <div
            className="status-dot safe"
            role="img"
            aria-label="Safety status: Nominal"
          ></div>
          <span>Safety: Nominal</span>
        </div>
        <div className="status-item">
          <div
            className="status-dot neutral"
            role="img"
            aria-label="Experience level: High"
          ></div>
          <span>Experience: High</span>
        </div>
        <div className="status-item">
          <div
            className="status-dot safe"
            role="img"
            aria-label="Efficiency: 94 percent"
          ></div>
          <span>Efficiency: 94%</span>
        </div>
      </div>

      <time
        className="time-display"
        dateTime={currentTime.toISOString()}
        aria-label={`Current time: ${currentTime.toLocaleTimeString()}`}
      >
        {currentTime.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </time>
    </header>
  );
}

export default Topbar;
