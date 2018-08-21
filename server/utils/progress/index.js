/* eslint no-plusplus: 0 */
const _ = require('lodash');
const moment = require('moment');
const { aggregateData, averageTimes, scoreProgress, scoreWakatimeAndAttendance } = require('./dropout');
const { getTrack } = require('./tracks');
const statementAggregator = require('../statementAggregator');

const track1 = [
  'Introduction to Programming with NodeJS (NODE100)',
  'HTML/CSS Basics (WEB100)',
  'JavaScript in the DOM (WEB101)',
  'Intro to Express (NODE101)',
  'Git/ChromeDevtools (OPS100)',
  'Beginner React (REACT100)',
  'Building and Deploying Apps (OPS200)',
  'Relational Databases (DB100)',
  'NO-SQL Databases (DB200)',
  'Intermediate Express (NODE200)',
  'Intermediate React (REACT200)'
];

/**
 * Get Enrollment data from LRS using a saved pipeline
 */
const getAllEnrolledTo = () =>
  statementAggregator('DURATIONS')
    .then(results => results.data)
    .catch(e => console.log(e));

/**
 * Get Login data from LRS using a saved pipeline
 */
const getAllLoginToMoodle = () =>
  statementAggregator('LOGIN_TO_MOODLE')
    .then(results => results.data)
    .catch(e => console.log(e));

/**
 * Get Wakatime data from LRS using a saved pipeline
 */
const getAllWakatimes = () =>
  statementAggregator('WAKATIME')
    .then(results => results.data)
    .catch(e => console.log(e));

/**
 * Get Attendance data from LRS using a saved pipeline
 * eg. [{ name: 'Alonzo Quintero',
       date: '04/26/2018',
       checkIn: '10:33:07 AM',
       checkOut: '5:30:00 PM' }]
 */
const getAllAttendances = () =>
  statementAggregator('TIME_ON_SITE_ALL_TIME')
  .then(results => results.data)
  .catch(e => console.log(e));

/**
 * Get a students trackId, default to track1 if not found
 *
 * @param {any} data
 * @param {any} users
 * @returns
 */
function getTrackByMoodleUserId(id, users) {
  if (id === undefined) return 'track1';
  const userdata = users.find(x => id == x.moodleUserId);
  // default to track1 if a track is not found
  return _.get(userdata, 'trackId', 'track1');
}

/**
 * Get a timestamp given a user and course from all the raw student data
 *
 * @param {string} student Name of a student
 * @param {string} course Name of a course
 * @param {array} allStudents Array of Objects that contain raw names of students, courses, and timestamp
 * @returns {string} found.timestamp A string representation of a date (timestamp)
 */
function getEnrollmentDateTime(student, course, allStudents) {
  // searches all raw data and only returns the time stamp if the student and course match
  const found = allStudents.find(x => x.moodleUserId === student && x.course === course);
  if (found === undefined) return null;
  return found.timestamp;
}

/**
 * Calculate duration of a period of time
 *
 * @param {string} start Start of period represented as a string timestamp
 * @param {string} end End of period represented as a string timestamp
 * @returns {number}
 */
function duration(start, end) {
  // must have a start and end date
  if (start !== null && end !== null) {
    const momentStart = moment(start);
    const momentEnd = moment(end);
    const momentDuration = moment.duration(momentStart.diff(momentEnd));
    const days = momentDuration.asDays();
    return Math.abs(days);
  }
  return 0;
}

/**
 * Calculates the duration of the time spent by comparing one course with previous course.
 * Relies on an array with all timestamps, and a track (which is the name and order of the courses).
 *
 * @param {array} startDates Array of objects that have all timestamps, and student's data
 * @param {array} [track] Array of strings that represent the courses in the order they are required
 * @returns {array} durations Array of objects that have the duration in days for each course per student
 */
function getDiff(startDates) {
  const durations = [];
  startDates.forEach((student) => {
    // current student name
    const name = Object.keys(student).toString();
    const courses = [];
    const track = getTrack(student[name].trackId);
    for (let i = 0; i < track.length; i++) {
      // compare current enrollment with next courses enrollment to calculate duration
      const result = (i === track.length - 1) ?
        null :
        duration(student[name][i + 1].timestamp, student[name][i].timestamp);
      // mutate the current student record with the result
      courses.push({
        courseName: student[name][i].course,
        duration: result,
        timestamp: student[name][i].timestamp
      });
    }
/**
  Example:

 [{ courseName: 'Introduction to Programming with NodeJS (NODE100)',
    duration: 0.008645833333333333,
    timestamp: '2017-06-14T20:04:03.000Z' },
  { courseName: 'HTML/CSS Basics (WEB100)',
    duration: 0.006469907407407408,
    timestamp: '2017-06-14T20:16:30.000Z' },
    ...
  ]
 */
    durations.push({ student: Object.keys(student).toString(), courses });
  });
  return durations;
}

/**
 * Generate time spent per course and create a user progress array per student.
 *
 * @param {array} users An array of user profile objects with data (name, moodleId, wakatime, progress, etc.)
 * @returns {array} An array of user objects with progress calculated (no dropout score)
 */
function getAllDurations(users) {
  return getAllEnrolledTo()
    .then((data) => {
      const students = _.uniqBy(data, 'moodleUserId');
      const startDates = students.map((student) => {
        const trackId = getTrackByMoodleUserId(student.moodleUserId, users);
        const track = getTrack(trackId);
        return {
          [student.moodleUserId]: track.map(course => ({
            course,
            trackId,
            timestamp: getEnrollmentDateTime(student.moodleUserId, course, data)
          }))
        };
      });
      return getDiff(startDates);
    });
}

/**
 * Returns statistics about moodle logins from the LRS.
 *
 * @returns
 */
function generateLoginStats() {
  return getAllLoginToMoodle();
}
/**
 * Generate a dropout score per user.
 *
 * @param {array} users An array of user profile objects
 * @returns An array of profile objects with a drop out score
 */
function generateDropoutScore(users) {
  const getAllUsers = () => Promise.resolve(users);
  return Promise.all([getAllDurations(users), getAllWakatimes(), getAllAttendances(), getAllUsers()])
    .then(alldata => aggregateData(alldata))
    .then(aggregatedData => averageTimes(aggregatedData))
    .then(data => scoreWakatimeAndAttendance(data, 'wakatime'))
    .then(data => scoreWakatimeAndAttendance(data, 'attendance'))
    .then(data => scoreProgress(data));
}

module.exports = {
  duration,
  getAllDurations,
  getEnrollmentDateTime,
  getDiff,
  generateLoginStats,
  generateDropoutScore,
  getAllWakatimes
};
