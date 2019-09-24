import React, { useState, useCallback } from 'react';
import './App.scss';

import HeatMapWidget from './components/HeatMapWidget/HeatMapWidget';

function App() {
  const [input, setInput] = useState('');
  const renderHeatMap = useCallback(() => {
    return (
      <div className="heatmap-wrapper">
        <HeatMapWidget />;
      </div>
    );
  }, []);
  return (
    <div className="App">
      <section className="header">
        <h1>GitHub Contributions Heatmap</h1>
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your Github account…"
          />
          <button type="button">Generate</button>
        </div>
      </section>
      <div>
        {renderHeatMap()}
      </div>
    </div>
  );
}

export default App;
