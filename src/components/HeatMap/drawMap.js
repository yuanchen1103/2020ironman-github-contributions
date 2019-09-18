import * as d3 from 'd3';
import moment from 'moment';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const drawMap = (id) => {
  const data = [];
  for (
    let i = moment('2019-01-01');
    i.isBefore('2020-01-01');
    i.add(1, 'days')
  ) {
    data.push({
      value: getRandomInt(0, 100),
      weekNum: i.week(),
      day: i.day()
    });
  }

  const margin = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  };

  const chartWidth = 860 - margin.left - margin.right;
  const chartHeight = 160 - margin.top - margin.bottom;

  const svg = d3
    .select(`#${id}`)
    .append('svg')
    .attr('width', chartWidth + margin.left + margin.right)
    .attr('height', chartHeight + margin.top + margin.bottom);

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  g.selectAll('.block')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'block')
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1)
    .attr('y', (d) => d.day * 15 + d.day * 1)
    .attr('fill', 'black')
    .attr('width', 15)
    .attr('height', 15)
    .attr('rx', 3);
};

export default drawMap;
