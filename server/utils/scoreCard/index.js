const _ = require('lodash');
const app = require('../../server');
const Moodle = require('../moodle');
const hubspot = require('../hubspot');
const statementAggregator = require('../statementAggregator');
const moment = require('moment');

const token = process.env.MDL_WEB_TOKEN;
const moodle = new Moodle(token);

/**
 * Returns concatenated string with accountability partner first and last name if they exist
 * @param {string} accountabilityPartnerFirstname first name
 * @param {string} accountabilityPartnerLastName last name
 */
const getAccountabilityPartnerFullName = (accountabilityPartnerFirstName, accountabilityPartnerLastName) => {
  let accountabilityPartnerName = null;
  if (accountabilityPartnerFirstName) {
    if (accountabilityPartnerLastName) {
      accountabilityPartnerName = `${accountabilityPartnerFirstName} ${accountabilityPartnerLastName}`;
    } else {
      accountabilityPartnerName = accountabilityPartnerFirstName;
    }
  }
  return accountabilityPartnerName;
};

/**
 * Grabs hubspot data
 * @param {string} email Email to search for user in hubspot
 * @returns {(Promise<{}>|null)} Filtered data from hubspot api
 */
const getHubspotData = async email =>
  await hubspot.getUserByEmail(email)
    .then(hubspotResponse => hubspotResponse.data)
    .then((hs) => {
      if (!hs) return null;

      const accountabilityPartnerFirstName = _.get(hs, 'properties.accountability_partner_first_name.value', null);
      const accountabilityPartnerLastName = _.get(hs, 'properties.accountability_partner_last_name.value', null);

      return {
        status: _.get(hs, 'properties.status.value', null),
        phone: _.get(hs, 'properties.phone.value', null),
        address: _.get(hs, 'properties.address.value', null),
        motivation: _.get(hs, 'properties.motivation.value', null),
        accountability: {
          name: getAccountabilityPartnerFullName(accountabilityPartnerFirstName, accountabilityPartnerLastName),
          email: _.get(hs, 'properties.accountability_partner_email.value', null) || null,
          phone: _.get(hs, 'properties.accountability_partner_phone_number.value', null) || null, // eslint-disable-line
          relationship: _.get(hs, 'properties.accountability_partner_relationship.value', null) || null, // eslint-disable-line
        }
      };
    })
    .catch(err => err);

/**
 * Retrieves all attendance data, merges check ins and leaves, generates hours in class, and returns an object of the last 14 days
 * @param {(string|number)} userId Moodle Id of user to retrieve attendance
 * @returns {(Promise<Array<{total: string, data: Array<{date: string, duration: string, in: Date, out: Date=}>}>|null)} Returns users last 14 days attendance data
 */
const getRecentAttendance = async (userId) => {
  const attWeek = await statementAggregator('ATTENDANCE_BY_STUDENT_ID_WEEK', {
    moodleUserId: `${userId}`
  }).then(attendance => attendance.data)
    .then((attendance) => {
      if (!attendance.length) return null;

      return attendance.reduce((a, e, i) => {
        const timeIn = moment(`${e.date} ${e.start}`, 'M/D/YYYY HH:mm:ss A');
        const timeOut = moment(`${e.date} ${e.end}`, 'M/D/YYYY HH:mm:ss A');
        a.data.push({
          date: timeIn.format('L'),
          dayOfWeek: timeIn.format('dddd'),
          duration: moment.duration(moment(timeOut).diff(timeIn)).asMilliseconds(),
          in: timeIn.format('h:mm a'),
          out: timeOut.format('h:mm a')
        });
        if (i === attendance.length - 1 && a.data.length === 0) return null;
        return a;
      }, { total: 0, data: [] });
    })
    .catch(err => err);

  const attToday = await statementAggregator('ATTENDANCE_BY_STUDENT_ID_TODAY', {
    moodleUserId: `${userId}`
  }).then(attendance => attendance.data)
    .then((attendance) => {
      if (!attendance.length) return null;
      return attendance.map((r) => {
        // We're going to reformat the attendance data
        const time = moment(r.timestamp);

        const formattedAttendance = {
          date: time.format('L'),
          dayOfWeek: time.format('dddd'),
          duration: moment.duration(moment().diff(time)).asMilliseconds(),
        };
        // If checkin, add in property, otherwise out property
        if (r.verbs[0].indexOf('checkin') !== -1) {
          formattedAttendance.in = time.format('h:mm a');
        } else formattedAttendance.out = time.format('h:mm a');

        return formattedAttendance;
      }).reduce((a, e) => {
        // We have an array of ins and outs, let's combine them
        const n = a.findIndex(r => r.date === e.date);

        // If an object with the same date already exists, combine current object with existing
        // Calculate a total between ins and outs and update total
        if (n !== -1) {
          a[n] = {
            ...e,
            ...a[n]
          };
          const time = moment(a[n].out).diff(moment(a[n].in));
          a[n].duration = time;
        } else a.push(e);

        return a;
      }, []);
    })
    .catch(() => null);

  // If there's attendance today but nothing this week
  if (attToday && !attWeek) {
    return {
      total: moment.duration(attToday[0].duration).as('hours').toFixed(2),
      data: attToday
    };
  } else if (attToday && attWeek.data[0] && attWeek.data[0].date !== attToday.date) {
    attWeek.data.unshift(attToday[0]);
  }

  if (attWeek) {
    const total = attWeek.data.reduce((a, b) => a + b.duration, 0);
    attWeek.data = attWeek.data.map(a =>
      ({ ...a, duration: moment.duration(a.duration).as('hours').toFixed(2) })
    );
    attWeek.total = moment.duration(total).as('hours').toFixed(2);
  }

  return attWeek;
};

/**
 * Retrieves attendance points and generates an object with total & data
 * @param {string|number} userId Moodle Id of user to retrieve points
 * @returns {(Promise<{total: number, data: Array<{ points: number, date: string}>}>|null)} Contains sum of attendance points and days where points have been added
 */
const getAttendancePoints = async userId =>
  await statementAggregator('ATTENDANCE_POINTS_BY_STUDENT_ID', {
    moodleUserId: `${userId}`
  })
    .then(lrsResponse => lrsResponse.data)
    .then((lrsResponse) => {
      if (!lrsResponse.length) return null;
      return {
        total: lrsResponse.reduce((sum, pointsObj) => (sum += +pointsObj.points), 0),
        data: lrsResponse.filter(r => +r.points)
      };
    })
    .catch(err => err);

/**
 * Retrieves wakatime stats for week and generates an object with total & data
 * @param {string|number} userId Moodle Id of user to retrieve wakatime data
 * @returns {(Promise<{total: string, data: Array<{date: string, duration: string}>}>|null)} Contains wakatime data for the past week
 */
const getWeeklyWakatime = async userId =>
  await statementAggregator('WAKATIME_WEEK_BY_STUDENT_ID', `${userId}`)
    .then(wakatime => wakatime.data)
    .then((wakatime) => {
      // Filter just this week
      const recentWakatime = moment().startOf('day').subtract(14, 'days');
      return wakatime.filter(i => moment(i.date).isAfter(recentWakatime));
    })
    .then((wakatime) => {
      if (!wakatime.length) return null;
      const totalMS = wakatime.reduce((acc, t) => (acc += (t.totalSeconds * 1000)), 0);
      return {
        total: moment.duration(totalMS).as('hours').toFixed(2),
        data: wakatime.map(o => (
          {
            date: moment(o.date).format('L'),
            duration: moment.duration(o.totalSeconds * 1000).as('hours').toFixed(2)
          }
        )),
      };
    })
    .catch(err => err);

/**
 * Aggregates information about a specific user and generates a score card
 * @param {string} id ID relating to document in user model
 * @returns {Promise<{}>} Contains data from lms, lrs, hubspot, and wakatime
 */
const scoreCard = id => new Promise(async (resolve, reject) => {
  if (!id || id === '{id}') reject('No user id was provided');

  const { user } = app.models;
  let moodleId = null;

  // Grab existing student data from Mongo, excluding following fields
  let retUser = await user.findOne({
    where: {
      or: [
        { moodleUserId: id },
        { _id: id }
      ]
    },
    fields: {
      disabled: false,
      mockData: false,
      password: false,
      trackId: false,
      emailVerified: false,
      scheduleId: false,
      enrolled: false,
      username: false
    }
  })
    .then(userData => userData)
    .catch(err => reject(err));

  // If user exists and has moodleId, update moodleId
  if (retUser && retUser.moodleUserId) moodleId = retUser.moodleUserId; // eslint-disable-line
  // If no user was found, reject
  if (!retUser) return reject(`Could not find user ${id}`);
  // If moodleId wasn't in document
  if (!moodleId) return reject(`No moodleUserId associated with ${id}`);

  // Make request to moodle for more info { email, lastaccess, profileimageurl }
  const moodleData = await moodle.getStudentsForId(moodleId)
  .then(moodleResponse => moodleResponse.users)
  .then((users) => {
    if (!users[0]) return null;
    return {
      email: users[0].email,
      lastaccess: users[0].lastaccess,
      profileimageurl: users[0].profileimageurl
    };
  })
  .catch(() => reject('Error connecting to Moodle'));

  // Replace yoda data with moodle, also get rid of that dangle
  if (moodleData) retUser = { ...retUser.__data, ...moodleData }; // eslint-disable-line 
  else return reject(`Couldn't find user ${moodleId} in moodle`);

  // Using email, query using hubspot integration (./hubspot) for accountability partner {name, email, phoneNumber}
  retUser.hubspot = await getHubspotData(retUser.email);
  retUser.recentAttendance = await getRecentAttendance(moodleId);
  retUser.attendancePoints = await getAttendancePoints(moodleId); // Using moodleId, query user for attendance points, create a sum of all points
  retUser.wakatimeThisWeek = await getWeeklyWakatime(moodleId);

  return resolve(retUser);
});

module.exports = {
  scoreCard,
  getWeeklyWakatime,
  getRecentAttendance,
  getAttendancePoints,
  getHubspotData
};
