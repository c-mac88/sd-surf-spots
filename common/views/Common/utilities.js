const secondsToDaysHoursMinsSecs = (secs) => {
  let d, h, m, s;
  // d = Math.floor(secs / 86400);
  // secs -= d * 86400;
  h = Math.floor(secs / 3600);
  secs -= h * 3600;
  m = Math.floor(secs / 60);
  secs -= m * 60;
  s = Math.floor(secs);

  let daysData = d ? d + ' days' : '';
  let hoursData = h ? h + ' hours' : '';
  let minsData = m + ' mins';
  let secsData = s + ' secs';

  // return `${daysData} ${hoursData} ${minsData} ${secsData}`;
  return `${daysData} ${hoursData} ${minsData}`;
};

const convertArrayOfObjectsToCSV = (args) => {
  const data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  const columnDelimiter = args.columnDelimiter || ',';
  const lineDelimiter = args.lineDelimiter || '\n';

  const keys = Object.keys(data[0]);

  let result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
};

const downloadCSV = (args) => {
  let csv = convertArrayOfObjectsToCSV({
    data: args.data
  });
  if (csv == null) return;

  const filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8, ${csv}`;
  }
  const data = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};

module.exports = {
  convertArrayOfObjectsToCSV,
  downloadCSV,
  secondsToDaysHoursMinsSecs
};
