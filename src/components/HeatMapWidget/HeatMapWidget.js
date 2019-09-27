import React from 'react';
import HeatMap from '../HeatMap/HeatMap';

import styles from './HeatMapWidget.module.scss';

const HeatMapWidget = ({title, chartData, isModalOpen, colors}) => {
  return (
    <div className={styles.wrapper}>
      <span>{title}</span>
      <HeatMap chartData={chartData} colors={colors} isModalOpen={isModalOpen}/>
    </div>
  );
};

export default React.memo(HeatMapWidget);
