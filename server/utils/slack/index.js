const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');
const { WebClient } = require('@slack/client');
const app = require('../../server');
const statementAggregator = require('../../utils/statementAggregator');
const { staffChannel, engineeringChannel, alertsChannel, timeClockMessageAttachments } = require('./serviceMonitor');
const { INSTRUCTORS_CHANNEL_ID, lateNotificationMessageAttachments } = require('./masterBot');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

let alertsChannelInterval;
let staffChannelTimeout;

Set.prototype.difference = function (setB) {
  const difference = new Set(this);
  setB.forEach(elem => difference.delete(elem));
  return difference;
};

/**
* Posts a message into the channel
* @param {string} text
* @param {string} channelId
*/
const messageUser = (text, channelId) => {
  web.chat.postMessage({ channel: channelId, text })
    .catch(err => console.log(err));
};

/**
* Gets the message to send to instructors based on user
* and type of response (button click) the user gave
* @param {string} slackUser
*/
const getInstructorMessage = (slackUser, type) =>
  (new Promise((resolve) => {
    switch (type) {
      case 'will-be-late': {
        resolve(`${slackUser.name} is going to be late to class today.`);
        break;
      }
      case 'will-miss-day': {
        resolve(`${slackUser.name} intends to not be present today in class.`);
        break;
      }
      default: {
        break;
      }
    }
  }));

/**
* Notifies Instructor's channel if a student is intending to be late or miss class.
* @param {string} slackUser
*/
const notifyInstuctors = async (slackUser, type) => {
  const text = await getInstructorMessage(slackUser, type);
  web.chat.postMessage({ channel: INSTRUCTORS_CHANNEL_ID, text, link_names: true })
    .catch(err => console.log(err));
};

/**
* Based on the button clicked by the student, select a response to send
* @param {string} type
*/
const getReturnMessage = type =>
  (new Promise((resolve) => {
    switch (type) {
      case 'forgot-clockin':
        resolve('Please clock-in now. Make sure you swipe only once and it signs you IN.');
        break;
      case 'will-be-late':
        resolve('Please clock-in when you arrive on site. Be ready to focus and make up for lost time.');
        break;
      case 'will-miss-day':
        resolve('Please be advised your score card will be docked. Be safe and we will see you tomorrow.');
        break;
      default:
        break;
    }
  }));

/**
* Send a Slack message to a late student
* @param {obj} student
*/
const slackLateStudent = (student) => {
  return new Promise((resolve, reject) => {
    const text = `Hello ${student.firstName}! You have not checked in today.`;
    const attachments = lateNotificationMessageAttachments;
    if (!!student.slackId) {
      web.im.open({ user: student.slackId })
        .then((res) => {
          if (res.ok) {
            web.chat.postMessage({ channel: res.channel.id, text, attachments })
              .then((res) => {
                if (res.ok) {
                  resolve(1)
                }
              })
              .catch(err => resolve(0));
          }
        })
        .catch(err => reject(err));
    }
  })
}


/**
* Send a Slack message to each of the indvidiual late students
* @param {array} students
*/
const sendMessages = (students) => {
  const promises = [0]
  for (let student of students) {
    promises.push(slackLateStudent(student))
  }
  return Promise.all(promises)
}

/**
* fetches all currently enrolled students and notifies every student
* that is late to class according to their schedule
*/
const notifyLateStudents = (scheduleId) => {
  const checkins = new Set();
  let today = new Date();
  today.setHours(7); // 7AM in UTC, Midnight PST
  today = today.toISOString();

  return new Promise((resolve, reject) => {
    app.models.user.getByScheduleId(scheduleId, (error, students) => {
      const studentSet = new Set(students.map(x => Number(x.moodleUserId)));

      // Get all of the checkins for today
      statementAggregator('GET_CHECK_INS_BY_DATE', { date: today })
        .then(async (resp) => {
          // add all the moodleUserIds to the checkin set, if we have a checkin time for them
          resp.data.forEach(statement => checkins.add(Number(statement.moodleUserId)));

          // create array of students who we don't have a checkin for
          const lateStudentsMoodleIds = studentSet.difference(checkins);
          const lateStudents = students.filter(student => lateStudentsMoodleIds.has(student.moodleUserId));

          // Send a late message to every person
          const count = await sendMessages(lateStudents)
            .then(response => {
              resolve(response.reduce((accumulator, currentValue) => accumulator + currentValue))
            })
            .catch(console.error)

        })
        .catch(err => reject(err));
    });
  });
};

const sendTimeClockServiceDisconnected = (socket) => {
  /**
  * Alert the development team (engineering channel) that time-clock display is down
  */
  let text = 'TIME-CLOCK DISCONNECTED\nClient has lost connection with server';
  text += '\nThe most likely solution is to refresh the wepbage at the kiosk';
  text += '\nFollow the instructions here to connect to the Mac Mini:';
  text += '\nhttps://origincodeacademy.atlassian.net/wiki/spaces/JA/pages/243892225/TIME-CLOCK';
  text += `Socket id: ${socket.id}\nTimestamp: ${moment().format()}`;

  axios.post(engineeringChannel, {
    text,
    attachments: timeClockMessageAttachments
  });

  /**
   * After one minute, if no one has confirmed from the engineering channel, send it to Staff channel.
   */
  staffChannelTimeout = setTimeout(() => {
    axios.post(staffChannel, {
      text,
      attachments: timeClockMessageAttachments
    });
  }, 1000 * 60);

  /**
   * If we don't receive confirmation from member in engineering or staff channel,
   * start sending to alerts channel every two minuntes until someone confirms
   */
  alertsChannelInterval = setTimeout(() => {
    axios.post(alertsChannel, {
      text,
      attachments: timeClockMessageAttachments
    });
  }, 1000 * 60 * 2);
};

const clearStaffChannelTimeout = () =>
  (new Promise((resolve) => {
    clearTimeout(staffChannelTimeout);
    resolve();
  }));

const clearAlertsChannelInterval = () =>
  (new Promise((resolve) => {
    clearTimeout(alertsChannelInterval);
    resolve();
  }));

module.exports = {
  sendTimeClockServiceDisconnected,
  clearAlertsChannelInterval,
  clearStaffChannelTimeout,
  messageUser,
  getReturnMessage,
  notifyLateStudents,
  notifyInstuctors,
  sendMessages
};
