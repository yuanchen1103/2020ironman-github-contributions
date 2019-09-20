import React, { useState, useEffect, useCallback } from 'react';
import shortid from 'shortid';

import drawMap from './drawMap';

const HeatMap = (props) => {
  const [id] = useState(`heatmap-${shortid.generate()}`);
  
  const handleDrawMap = useCallback(() => {
    drawMap(id);
  }, [id]);

  useEffect(() => {
    handleDrawMap()
  }, [handleDrawMap]);

  return <div id={id}></div>;
};

export default React.memo(HeatMap);
