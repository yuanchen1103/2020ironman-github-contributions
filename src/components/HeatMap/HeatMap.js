import React, { useState, useCallback, useEffect } from 'react';
import shortid from 'shortid';
import * as d3 from 'd3';

import drawMap from './drawMap';
import styles from './HeatMap.module.scss';

const HeatMap = ({ chartData, colors, isModalOpen }) => {
  const [id] = useState(`heatmap-${shortid.generate()}`);
  const handleDrawMap = useCallback(() => {
    drawMap(id, styles, chartData, colors);
  }, [id, chartData, colors]);

  useEffect(() => {
    if (!isModalOpen) {
      d3.select(`#${id} svg`).remove();
      d3.selectAll(`#${id} .${styles.messageWrapper}`).remove();
      handleDrawMap();
    }
  }, [isModalOpen]);

  return <div id={id} className={styles.container}></div>;
};

export default HeatMap;
