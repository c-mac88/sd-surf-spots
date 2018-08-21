const _ = require('lodash');
const moment = require('moment');
const { getTrack } = require('./tracks');

const weight = {
  wakatime: 45,
  attendance: 35,
  progress: 20
};

/**
 *
 * Given an array of student progress, transform to flatten it out.
 *
 * eg. progress
  {"fullName":"Devin Ledesma","firstName":"Devin","lastName":"Ledesma","email":"dxangobiz@gmail.com",
  "moodleUserId":100,"wakatimeApiKey":"2295ac5c-18f3-4205-b9e7-68a599c0feee",
  "trackId":"track1","studentType":"FULL","mockData":true,"disabled":false,"inClass":false,
  "username":"dxangobiz@gmail.com","emailVerified":true,"id":"5a5691a314eda6c52d8c6848",
  "progress":[{"courseName":"Introduction to Programming with NodeJS (NODE100)","duration":0,
  "timestamp":"2017-09-18T16:55:34.000Z"},{"courseName":"HTML/CSS Basics (WEB100)","duration":0,"timestamp":null}
  ...}
 *
 * eg. user
  {"fullName":"Renzo Aspillaga","firstName":"Renzo","lastName":"Aspillaga",
  "email":"renzopozo@yahoo.com","moodleUserId":139,"wakatimeApiKey":"84716377-db72-4d45-b77b-8b369e976522",
  "trackId":"track1","studentType":"FULL","mockData":true,"disabled":false,"inClass":false,
  "username":"renzopozo@yahoo.com","emailVerified":true,"id":"5a5691a314eda6c52d8c6865"}
 *
 * @param {object} progress
 * @param {object} user
 * @returns
 */
function transformProgress(progress, user) {
  const temp = [];
  progress.filter(x => x.student == user.moodleUserId)
    .map(courses => temp.push(courses.courses));
  return temp[0];
}

/**
 *
 * Given an array of wakatime timestamps, transform to flatten it out.
 *
 * eg. wakatime
    [{"timestamp":"2018-01-17T23:11:54.998Z","fullName":"Brendan Prince",
    "grandTotal":13644,"projects":[
    {"name":"startnow-react200-movie-finder","totalSeconds":6765},
    {"name":"startnow-react200-weather-app","totalSeconds":5940},
    {"name":"startnow-react200-budget-tracker","totalSeconds":545},
    ...}]
 *
 * eg. user
 * (see above)
 *
 * @param {object} wakatime
 * @param {object} user
 * @returns
 */
function transformWakatime(wakatime, user) {
  const wakatimes = wakatime
    .filter(x => x.fullName === user.fullName)
    .map(times => ({ date: times.timestamp, minutes: times.grandTotal }));
  const total = (wakatimes
    // wakatime total stored as seconds, divide by 60 to return minutes
    .reduce((acc, t) => acc + t.minutes, 0) / 60);
  return { total, wakatimes };
}

/**
 *
 * Given an array of attendance timestamps, transform to flatten it out.
 *
 * eg. attendances [{ name: 'Alonzo Quintero',
       date: '04/26/2018',
       checkIn: '10:33:07 AM',
       checkOut: '5:30:00 PM' }]
 *
 * eg. user
 * (see above)
 *
 * @param {object} attendances
 * @param {object} user
 * @returns
 */
function transformAttendance(attendances, user) {
  const attendance = attendances
    .filter(x => x.name === user.fullName)
    .map((times) => {
      const start = times.checkIn;
      const end = times.checkOut;
      const minutes = moment(end, 'hh:mm:ss A').diff(moment(start, 'hh:mm:ss A'), 'minutes', true);
      return { date: times.date, minutes };
    });
  const total = (attendance
    .reduce((acc, t) => acc + t.minutes, 0));
  return { total, attendance };
}

// group the data per user
function aggregateData(data) {
  const ProgressData = data[0];
  const WakatimeData = data[1];
  const AttendanceData = data[2];
  const UserData = data[3];

  return UserData.map((user) => {
    const progress = transformProgress(ProgressData, user);
    const wakatimes = transformWakatime(WakatimeData, user);
    const attendance = transformAttendance(AttendanceData, user);
    const actual = user.toObject();

    return Object.assign({}, actual, {
      progress,
      wakatime: wakatimes.wakatimes,
      timeCoding: wakatimes.total,
      attendance: attendance.attendance,
      timeOnSite: attendance.total
    });
  });
}

/**
 * get the average daily time for students time spent coding and attendance
 * return object with two values, class average for full time and class average for part time
 *
 * @param {array} aggregatedUserData
 * @param {string} type wakatime or attendance
 */
function averageWakatimeAndAttendance(aggregatedUserData, type) {
  let countFull = 0;
  let countPart = 0;
  let runningTotalFull = 0;
  let runningTotalPart = 0;
  const retVal = {};

  return new Promise(async (resolve) => {
    // timeCoding or timeOnSite holds the users totals in minutes
    const total = type === 'wakatime' ? 'timeCoding' : 'timeOnSite';
    // create arrays for full and part time students
    const fullTimers = aggregatedUserData.filter(x => x.studentType === 'FULL');
    const partTimers = aggregatedUserData.filter(x => x.studentType === 'PART');
    // sort the array by totals
    const sortedFull = fullTimers.slice().sort((a, b) => a[total] - b[total]);
    const sortedPart = partTimers.slice().sort((a, b) => a[total] - b[total]);
    // set the amount to remove from the head and tail
    const remove = 0;
    const curveFull = sortedFull.slice(remove, sortedFull.length - remove);
    const curvePart = sortedPart.slice(remove, sortedPart.length - remove);
    // join the arrays after removing head and tail from each
    const curve = [...curveFull, ...curvePart];
    const usersWithDailyAverage = await curve.map((user) => {
      // [total] will be either 'timeCoding' or 'timeOnSite' which is their respective totals
      // [type] will be 'wakatime' or 'attendance' which is an array of all their times
      if (user[total] > 0 && user[type].length > 0) {
        const sorted = user[type].sort((a, b) => new Date(a.date) - new Date(b.date));
        const startDate = new Date(sorted[0].date).toISOString();
        const length = moment().diff(startDate, 'days');
        const dailyAverage = (user[total] / length);
        user[`${type}DailyAverage`] = dailyAverage;
        if (user.studentType === 'FULL') {
          runningTotalFull += dailyAverage;
          countFull += 1;
        } else if (user.studentType === 'PART') {
          runningTotalPart += dailyAverage;
          countPart += 1;
        }
        return user;
      }
      return user;
    });
    retVal.full = (runningTotalFull / countFull).toFixed(2);
    retVal.part = (runningTotalPart / countPart).toFixed(2);
    resolve([retVal, usersWithDailyAverage]);
  });
}

async function averageTimes(aggregatedUserData) {
  // get the average amount of time spent coding for all students (FULL and PART)
  const wakatimeAverage = await averageWakatimeAndAttendance(aggregatedUserData, 'wakatime');
  const attendanceAverage = await averageWakatimeAndAttendance(wakatimeAverage[1], 'attendance');
  const returnUsers = attendanceAverage[1];
  const tracks = ['track1', 'track2'];
  // for each of the tracks
  const allTracks = tracks.map((trackId) => {
    // for each course in the track
    const averageData = getTrack(trackId).map((course) => {
      const totals = [];
      // using all the students aggregated data (wakatime and progress)
      aggregatedUserData.map((user) => {
        const progress = _.get(user, 'progress');
        // default to track1 if none found
        const usersTrack = _.get(user, 'trackId', 'track1');
        // check that we have progress and that user completed this track
        if (progress !== undefined && usersTrack == trackId) {
          // find only the times for the current course
          const filtered = progress.find(x => x.courseName == course);
          // only count this student's progress if they have a non zero duration
          const isPosDuration = _.get(filtered, 'duration');
          if (isPosDuration > 0) {
            // normalize full and part time students time spent
            const duration = (user.studentType === 'FULL') ?
              totals.push(filtered.duration) : totals.push(filtered.duration / 2);
          }
        }
        return true;
      });
      // now do the math on the resulting array of data

      // slice prevents the array itself from being sorted
      const sorted = totals.slice().sort((a, b) => a - b);
      // set the amount to remove from the head and tail
      const remove = 2;
      const curve = sorted.slice(remove, sorted.length - remove);
      // calculate the stats based on the curve
      const sum = curve.reduce((acc, x) => acc + x, 0).toFixed(2);
      const avg = (sum / curve.length).toFixed(2);
      const max = Math.max(...curve).toFixed(2);
      const min = Math.min(...curve).toFixed(2);
      return { course, avg, max, min };
    });
    return averageData;
  });
  return [returnUsers, allTracks, wakatimeAverage[0], attendanceAverage[0]];
}

/**
 * Recieves an array with aggregated user data, and stats for wakatime/attendance averages
 * calculates a value based on user vs class average and returns all users
 *
 * @param {any} data
 * @param {string} type wakatime or attendance
 * @returns {array} returnValue[0] is a list of users with their wakatime and attendance score
 *                  returnValue[1] is an array of tracks, containing the average Progress scores per course
 *                  returnValue[2] is an object containing the class Wakatime daily average in minutes i.e. { full: '162', part: '90' }
 *                  returnValue[3] is an object containing the class Attendance daily average in minutes i.e. { full: '162', part: '90' }
 */
async function scoreWakatimeAndAttendance(data, type) {
  const aggregatedUserData = data[0];
  const averages = type === 'wakatime' ? data[2] : data[3];
  const average = type === 'wakatime' ? 'wakatimeDailyAverage' : 'attendanceDailyAverage';
  const withScores = aggregatedUserData.map((user) => {
    if (user.studentType === 'FULL' && !!user[average]) {
      const score = (100 * (user[average] / averages.full));
      user[`${type}Score`] = Number(score.toFixed(2));
      return user;
    } else if (user.studentType === 'PART' && !!user[average]) {
      const score = (100 * (user[average] / averages.part));
      user[`${type}Score`] = Number(score.toFixed(2));
      return user;
    }
    return user;
  });
  return [withScores, data[1], data[2], data[3]];
}

/**
 * Recieves an array with aggregated user data, and stats for each track
 * calculates a value based on user vs average and returns all users
 *
 * @param {any} data
 */
function scoreProgress(data) {
  const aggregatedUserData = data[0];
  const track1stats = data[1][0];
  const track2stats = data[1][0];

  const withScores = aggregatedUserData.map((user) => {
    // select the track for stats based on which matches the current user
    const track = (user.trackId == 'track2') ? track2stats : track1stats;
    if (_.get(user, 'progress')) {
      const progress = user.progress.map((course) => {
        // if course does not yet have stats, make them null
        const stats = track.find(x => x.course == course.courseName) || { avg: null };
        // calculate the full or part time factor
        const paceFactor = (user.studentType === 'FULL') ? 1 : 0.5;
        const adjustedDuration = (course.duration * paceFactor);
        let score = Math.round(100 * (stats.avg / adjustedDuration));
        if (score > 600 && score < Infinity) score = 100;
        // TODO: do we need a max score per course??
        return Object.assign({}, course, { adjustedDuration, score, avg: stats.avg });
      });
      const totalDurationInCourses = progress.reduce((acc, course) => {
        if (Number.isInteger(course.score)) return acc + course.score;
        return acc;
      }, 0);
      const completedCourseCount = progress.filter(course => course.duration > 0).length;
      const missingDataMessage = 'missing data, not factored into final score';

      // return updated progress with scores
      const progressScore = (totalDurationInCourses / completedCourseCount);
      const weightedProgressScore = (totalDurationInCourses / completedCourseCount) * weight.progress;
      if (!!user.attendanceScore && !!user.wakatimeScore) {
        const weightedAttendanceScore = user.attendanceScore * weight.attendance;
        const weightedWakatimeScore = user.wakatimeScore * weight.wakatime;
        const totalWeighted = (weightedProgressScore + weightedAttendanceScore + weightedWakatimeScore) / 100;
        return Object.assign({}, user, { progress, progressScore, attendanceScore: user.attendanceScore, wakatimeScore: user.wakatimeScore, combinedWeightedScore: totalWeighted });
      } else if (!!user.attendanceScore) {
        const weightedAttendanceScore = user.attendanceScore * (100 - weight.progress);
        const totalWeighted = (weightedProgressScore + weightedAttendanceScore) / 100;
        return Object.assign({}, user, { progress, progressScore, attendanceScore: user.attendanceScore, wakatimeScore: missingDataMessage, combinedWeightedScore: totalWeighted });
      } else if (!!user.wakatimeScore) {
        const weightedWakatimeScore = user.wakatimeScore * (100 - weight.progress);
        const totalWeighted = (weightedProgressScore + weightedWakatimeScore) / 100;
        return Object.assign({}, user, { progress, progressScore, attendanceScore: missingDataMessage, wakatimeScore: user.wakatimeScore, combinedWeightedScore: totalWeighted });
      }
      return Object.assign({}, user, { progress, progressScore, attendanceScore: missingDataMessage, wakatimeScore: missingDataMessage, combinedWeightedScore: progressScore });
    }
    // just return user if they have no progress
    user.progress = [];
    return user;
  });
  return withScores;
}

module.exports = {
  aggregateData,
  averageTimes,
  scoreProgress,
  scoreWakatimeAndAttendance
};
