import * as d3 from 'd3';
import moment from 'moment';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const drawMap = (id) => {
  if (!document.getElementById(id)) return;

  const data = [];
  for (
    let i = moment('2019-01-01');
    i.isBefore('2020-01-01');
    i.add(1, 'days')
  ) {
    data.push({
      value: getRandomInt(0, 100),
      weekNum: i.week(),
      day: i.day(),
      date: i.format('YYYY-MM-DD')
    });
  }

  const margin = {
    top: 15,
    bottom: 15,
    left: 20,
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

  const colorScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data.map((e) => e.value)) / 2,
      d3.max(data.map((e) => e.value))
    ])
    .range(['#F3F3F3', '#84B6FD', '#8E87FA']);

  g.selectAll('.block')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'block')
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1)
    .attr('y', (d) => d.day * 15 + d.day * 1)
    .attr('fill', (d) => colorScale(d.value))
    .attr('width', 15)
    .attr('height', 15)
    .attr('rx', 3);

  const days = [0, 1, 2, 3, 4, 5, 6];

  g
    .selectAll('.day-label')
    .data(days)
    .enter()
    .append('text')
    .attr('class', 'day-label')
    .text((d) =>
      moment()
        .isoWeekday(d)
        .format('ddd')
    )
    .attr('font-size', 8)
    .attr('fill', '#B8B8B8')
    .attr('opacity', (d, i) => (i % 2 === 0 ? 1 : 0))
    .attr('x', -20)
    .attr('y', (d, i) => i * 15 + i * 1 + 9);

  const monthFirstDays = data.filter(e => e.date.substring(8, 10) === '01');

  g
    .selectAll('.month-label')
    .data(monthFirstDays)
    .enter()
    .append('text')
    .attr('class', 'month-label')
    .text((d) =>
      moment(d.date)
        .format('M')
    )
    .attr('font-size', 8)
    .attr('fill', '#B8B8B8')
    .attr('text-anchor', 'middle')
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1 + 7.5)
    .attr('y', -5);
};

export default drawMap;
