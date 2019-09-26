import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { SketchPicker } from 'react-color';
import './App.scss';

import { groupDataByYear } from './computeData';

import HeatMapWidget from './components/HeatMapWidget/HeatMapWidget';

import deleteIcon from './assets/delete.svg';
import addIcon from './assets/add.svg';

Modal.setAppElement('#root');

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colors, setColors] = useState([
    {
      color: '#F3F3F3',
      showPicker: false
    },
    {
      color: '#84B6FD',
      showPicker: false
    },
    {
      color: '#8E87FA',
      showPicker: false
    }
  ]);

  const addColor = useCallback(() => {
    setColors([
      ...colors,
      {
        color: '#fafafa',
        showPicker: false
      }
    ]);
  }, [colors]);

  const deleteColor = useCallback(
    (index) => {
      setColors([...colors].filter((e, i) => i !== index));
    },
    [colors]
  );

  const toggleColorPicker = useCallback(
    (index) => {
      const newColors = [...colors];
      newColors[index].showPicker = !colors[index].showPicker;
      setColors(newColors);
    },
    [colors]
  );

  const updateColor = useCallback(
    (index, color) => {
      const newColors = [...colors];
      newColors[index].color = color.hex;
      setColors(newColors);
    },
    [colors]
  );

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
    <div className="App" id="app">
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
        <button
          type="button"
          className="setting-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Date & Color Settings
        </button>
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
      <Modal
        isOpen={isModalOpen}
        style={{
          content: {
            background: '#FFFFFF',
            borderRadius: 9,
            width: 356,
            minHeight: 386,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <table style={{ marginTop: 48 }}>
          <tbody>
            <tr>
              <td className="label">Color</td>
              <td>
                {colors.map((item, i) => (
                  <div className="color-group" key={i}>
                    {item.showPicker && (
                      <div className="color-picker">
                        <SketchPicker
                          color={item.color}
                          onChangeComplete={(color) => updateColor(i, color)}
                        />
                      </div>
                    )}
                    <div
                      className="color-block"
                      style={{ backgroundColor: item.color }}
                      onClick={() => toggleColorPicker(i)}
                    ></div>
                    <img
                      src={deleteIcon}
                      alt=""
                      onClick={() => deleteColor(i)}
                    />
                  </div>
                ))}
                {colors.length < 5 && (
                  <img
                    src={addIcon}
                    alt=""
                    className="add-icon"
                    onClick={addColor}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </div>
  );
}

export default App;
