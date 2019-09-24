import React from 'react';
import HeatMap from '../HeatMap/HeatMap';

import styles from './HeatMapWidget.module.scss';

const HeatMapWidget = ({title, chartData}) => {
  return (
    <div className={styles.wrapper}>
      <span>{title}</span>
      <HeatMap chartData={chartData}/>
    </div>
  );
};

export default React.memo(HeatMapWidget);
