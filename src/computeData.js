import moment from 'moment';
import chunk from 'lodash/chunk';

export const groupDataByYear = (data) => {
  const arr = data.contributions;
  const result = {};
  for (let i = 0; i < arr.length; i += 1) {
    const momentObj = moment(arr[i].date);
    const year = momentObj.format('YYYY');
    if (!result[year]) {
      result[year] = [];
    }

    result[year].push({
      value: arr[i].count || 0,
      weekNum:
        momentObj.weekYear() === Number(year)
          ? momentObj.week()
          : momentObj.week() + moment(`${year}-01-01`).weeksInYear(),
      day: momentObj.day(),
      date: momentObj.format('YYYY-MM-DD'),
      weekYear: momentObj.weekYear()
    });
  }
  console.log(result);
  return result;
};

export const groupDataByCustom = (dateRange, data) => {
  const { startDate, endDate } = dateRange;
  const arr = data.contributions;
  const dateKeysData = {};
  for (let i = 0; i < arr.length; i += 1) {
    const momentObj = moment(arr[i].date);
    dateKeysData[momentObj.format('YYYY-MM-DD')] = arr[i].count || 0;
  }
  const tmp = [];
  for (let i = moment(startDate); i.isSameOrBefore(endDate); i.add(1, 'days')) {
    tmp.push({
      value: dateKeysData[i.format('YYYY-MM-DD')] || 0,
      oldWeekNum:
        i.weekYear() === Number(i.format('YYYY'))
          ? i.week()
          : i.week() + moment(`${i.format('YYYY')}-01-01`).weeksInYear(),
      day: i.day(),
      date: i.format('YYYY-MM-DD'),
      weekYear: i.weekYear()
    });
  }
  const dataGroupBy365Days = chunk(tmp.reverse(), 365);
  for (let i = 0; i < dataGroupBy365Days.length; i+=1) {
    dataGroupBy365Days[i] = dataGroupBy365Days[i].reverse();
    let currentWeekNum;
    let newWeekNum = 0;
    for (let j = 0; j < dataGroupBy365Days[i].length; j+=1) {
      if (dataGroupBy365Days[i][j].oldWeekNum === currentWeekNum) {
        dataGroupBy365Days[i][j].weekNum = newWeekNum;
      } else {
        newWeekNum += 1
        currentWeekNum = dataGroupBy365Days[i][j].oldWeekNum;
        dataGroupBy365Days[i][j].weekNum = newWeekNum;
      }

    }
  }

  const result = {};
  for (let i = 0; i < dataGroupBy365Days.length; i += 1) {
    const el = dataGroupBy365Days[i];
    result[`${el[0].date} ~ ${el[el.length - 1].date}`] = dataGroupBy365Days[i];
  }
  return result;
};
