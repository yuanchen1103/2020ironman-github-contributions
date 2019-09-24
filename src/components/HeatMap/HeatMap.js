import React, { useState, useEffect, useCallback } from 'react';
import shortid from 'shortid';

import drawMap from './drawMap';
import styles from './HeatMap.module.scss';

const HeatMap = ({chartData}) => {
  const [id] = useState(`heatmap-${shortid.generate()}`);
  
  const handleDrawMap = useCallback(() => {
    drawMap(id, styles, chartData);
  }, [id, chartData]);

  useEffect(() => {
    handleDrawMap()
  }, []);

  return <div id={id} className={styles.container}></div>;
};

export default React.memo(HeatMap);
