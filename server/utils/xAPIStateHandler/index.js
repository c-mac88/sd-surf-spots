const axios = require('axios');

const baseUrl = 'http://lrs.origincodeacademy.com/data/xAPI/activities/state';

const getActivityId = (activity) => {
  let activityURI;
  switch (activity) {
    // for storing student progress in code challenges
    case 'PERFORMANCE':
      activityURI = 'http://id.tincanapi.com/activitytype/performance';
      break;
    // for storing progress in a course
    case 'COURSE':
      activityURI = 'http://id.tincanapi.com/activitytype/course';
      break;
    // for storing progress in a Quiz
    case 'ASSESSMENT':
      activityURI = 'http://id.tincanapi.com/activitytype/assessment';
      break;
    default:
      activityURI = '';
  }
  return activityURI;
};

/**
 * save a mutable JSON object about an activity and an agent
 * Activity must be a registered URI, i.e. http://adlnet.gov/expapi/activities/school-assignment
 * stateId is a unique identifier set by us
 * agent is an object which should contain at least student moodle User Id
 *
 * @param {string} activityType
 * @param {string} stateId
 * @param {object} agent
 * @param {object} stateObject
 */
const setState = (activityType, stateId, agent, stateObject) =>
  axios({
    url: encodeURI(`${baseUrl}?activityId=${getActivityId(activityType)}&stateId=${stateId}&agent=${agent}`),
    method: 'post',
    auth: {
      username: process.env.LRS_USER,
      password: process.env.LRS_PWD
    },
    headers: {
      'X-Experience-API-Version': '1.0.3',
      'Content-Type': 'application/json'
    },
    data: stateObject
  });

const getState = (activityType, stateId, agent) =>
  axios({
    url: encodeURI(`${baseUrl}?activityId=${getActivityId(activityType)}&stateId=${stateId}&agent=${JSON.stringify(agent)}`),
    method: 'get',
    auth: {
      username: process.env.LRS_USER,
      password: process.env.LRS_PWD
    },
    headers: {
      'X-Experience-API-Version': '1.0.3',
      'Content-Type': 'application/json'
    }
  });

const destroyState = (activityType, stateId, agent) =>
  axios({
    url: encodeURI(`${baseUrl}?activityId=${getActivityId(activityType)}&stateId=${stateId}&agent=${JSON.stringify(agent)}`),
    method: 'delete',
    auth: {
      username: process.env.LRS_USER,
      password: process.env.LRS_PWD
    },
    headers: {
      'X-Experience-API-Version': '1.0.3',
      'Content-Type': 'application/json'
    }
  });

/**
 * save xAPI state with any data you need. You can add to the object infinitely.
 * Only the property you specify will be overwritten. The other properties
 * will persist.
 *
 * @param {string} moodleUserId id of the LRS statement of student last completed step
 * @param {string} status which object to save in state
 * @param {object} data last Assignment, last step, or meta Data about current challenge
 * @returns {boolean} save was successful or not
 */
const setXapiState = (moodleUserId, type, data, status = null) => {
  const agent = { account: { name: moodleUserId.toString(), homePage: 'http://lms.origincodeacademy.com' } };
  let stateObject = {};
  switch (type) {
    case 'PERFORMANCE': {
      stateObject.status = status;
      switch (status) {
        case 'previousAssignment':
          stateObject.previousAssignment = data;
          break;
        case 'previousStep':
          stateObject.previousStep = data;
          break;
        case 'metaData':
          stateObject.metaData = data;
          break;
        case 'newState':
          stateObject.metaData = {};
          break;
        default:
          break;
      }
      break;
    }
    case 'COURSE': {
      stateObject = Object.assign({}, data);
      break;
    }
    case 'ASSESSMENT': {
      stateObject = Object.assign({}, data);
      break;
    }
    default:
      stateObject = Object.assign({}, data);
      break;
  }
  return setState(type, moodleUserId.toString(), JSON.stringify(agent), stateObject);
};

/**
 * retrieves the xAPI state
 *
 * @param {string} moodleUserId student Moodle User ID
 * @returns {Promise<object>} object contatining the xAPI state
 */
const getXapiState = (moodleUserId, type) => {
  const agent = { account: { name: moodleUserId.toString(), homePage: 'http://lms.origincodeacademy.com' } };
  return getState(type, moodleUserId, agent);
};

/**
 * retrieves the xAPI state
 *
 * @param {string} moodleUserId student Moodle User ID
 * @returns {Promise<object>} object contatining the xAPI state
 */
const destroyXapiState = (moodleUserId, type) => {
  const agent = { account: { name: moodleUserId.toString(), homePage: 'http://lms.origincodeacademy.com' } };
  return destroyState(type, moodleUserId, agent);
};

module.exports = { setState, getState, setXapiState, getXapiState, destroyXapiState };
