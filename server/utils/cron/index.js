const app = require('../../server');
const moment = require('moment-timezone');
// get the UTC offset based on local time (Pacific)
const utcOffset = Math.abs(moment().tz('America/Los_Angeles').utcOffset() / 60);
const { Schedule } = app.models;

const getSchedulesForLateNotifications = weekday =>
  new Promise((resolve, reject) => {
    Schedule.find()
    .then(async (schedules) => {
      const scheduleJobs = await schedules.map((schedule) => {
        // convert the time to hours and minutes, then create a date string, which will be in UTC time.
        const startTime = schedule.schedule[weekday].in.split(':');
        const hours = Number(startTime[0]) + utcOffset;
        const minutes = Number(startTime[1]) + 15;
        const date = new Date();
        date.setHours(hours, minutes);
        // return the schedule id and date to run the job
        return { id: schedule.id, date };
      });
      resolve(scheduleJobs);
    })
    .catch(err => reject(err));
  });

module.exports = {
  getSchedulesForLateNotifications
};
