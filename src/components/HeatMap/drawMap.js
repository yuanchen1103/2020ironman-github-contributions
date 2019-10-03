import * as d3 from 'd3';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

const generateDomain = (colorLength, max) => {
  const result = [];
  const first = 0;
  const tolerance = max / (colorLength - 1);
  for (let i = 0; i < colorLength; i += 1) {
    result.push(first + i * tolerance);
  }
  return result;
};

const drawMap = (id, styles, chartData, colors) => {
  if (!document.getElementById(id)) return;
  const data = sortBy(chartData, ['date']);
  const margin = {
    top: 15,
    bottom: 15,
    left: 20,
    right: 15
  };

  const chartWidth = 900 - margin.left - margin.right;
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
    .domain(generateDomain(colors.length, d3.max(data.map((e) => e.value))))
    .range(colors);

  const messageWrapper = d3
    .select(`#${id}`)
    .append('div')
    .attr('class', styles.messageWrapper)
    .html(
      `<div class="${styles.circle}"></div><div class="${styles.data}"></div>`
    )
    .attr('style', 'display: none;');

  g.selectAll('.block')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'block')
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1 + 7.5)
    .attr('y', (d) => d.day * 15 + d.day * 1 + 7.5)
    .attr('fill', (d) => colorScale(0))
    .attr('width', 0)
    .attr('height', 0)
    .on('mouseover', function(d) {
      d3.select(this)
        .attr('stroke', d3.rgb(colorScale(d.value)).darker(0.5))
        .attr('stroke-width', 2);

      d3.select(`#${id} .${styles.messageWrapper} .${styles.data}`).html(
        `${d.date} : ${d.value}`
      );
      d3.select(`#${id} .${styles.messageWrapper} .${styles.circle}`).attr(
        'style',
        `background-color: ${colorScale(d.value)}`
      );

      messageWrapper.attr(
        'style',
        () =>
          `display: flex; left: ${(d.weekNum - 1) * 15 +
            (d.weekNum - 1) * 1 +
            50}px; top: ${d.day * 15 + d.day * 1}px`
      );
    })
    .on('mouseleave', function() {
      d3.select(this).attr('stroke-width', '0');
      messageWrapper.attr('style', () => 'display: none;');
    })
    .transition()
    .duration(1000)
    .delay((d, i) => i * 3)
    .attr('fill', (d) => colorScale(d.value))
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1)
    .attr('y', (d) => d.day * 15 + d.day * 1)
    .attr('width', 15)
    .attr('height', 15)
    .attr('rx', 3);

  const days = [0, 1, 2, 3, 4, 5, 6];

  g.selectAll('.day-label')
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

  const monthFirstDays = data.filter((e) => e.date.substring(8, 10) === '01');

  g.selectAll('.month-label')
    .data(monthFirstDays)
    .enter()
    .append('text')
    .attr('class', 'month-label')
    .text((d) => moment(d.date).format('M'))
    .attr('font-size', 8)
    .attr('fill', '#B8B8B8')
    .attr('text-anchor', 'middle')
    .attr('x', (d) => (d.weekNum - 1) * 15 + (d.weekNum - 1) * 1 + 7.5)
    .attr('y', -5);
};

export default drawMap;
