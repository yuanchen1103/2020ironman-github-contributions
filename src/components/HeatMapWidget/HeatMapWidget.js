import React from 'react';
import HeatMap from '../HeatMap/HeatMap';

import styles from './HeatMapWidget.module.scss';

const HeatMapWidget = () => {
  return (
    <div className={styles.wrapper}>
      <span>2019 103 contributions</span>
      <HeatMap />
    </div>
  );
};

export default React.memo(HeatMapWidget);
