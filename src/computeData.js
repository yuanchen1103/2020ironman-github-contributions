import moment from 'moment';

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
  return result;
};
