import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.scss';

import { groupDataByYear } from './computeData';

import HeatMapWidget from './components/HeatMapWidget/HeatMapWidget';

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(() => {
    if (!input.length) return;
    setIsLoading(true);
    axios
      .get(`https://github-contributions-api.now.sh/v1/${input}`)
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setData(null);
        console.error(err);
      });
  }, [input]);

  const renderHeatMap = useCallback(() => {
    const groupData = groupDataByYear(data);
    return Object.keys(groupData)
      .sort()
      .reverse()
      .map((year) => (
        <div className="heatmap-wrapper" key={year}>
          <HeatMapWidget
            title={`${year} ${!!data.years.find((e) => e.year === year) &&
              data.years.find((e) => e.year === year).total} contributions`}
            chartData={groupData[year]}
          />
        </div>
      ));
  }, [data]);

  const renderLoading = useCallback(
    () => (
      <>
        <div className="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    ),
    []
  );

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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                getData();
              }
            }}
          />
          <button type="button" onClick={getData}>
            Generate
          </button>
        </div>
      </section>
      <div>
        {!!data &&
          !!data.years &&
          !!data.years.length &&
          !isLoading &&
          renderHeatMap()}
        {isLoading && renderLoading()}
        {!!data && !!data.years && !data.years.length && !isLoading && (
          <h5>No Data Found</h5>
        )}
      </div>
    </div>
  );
}

export default App;
