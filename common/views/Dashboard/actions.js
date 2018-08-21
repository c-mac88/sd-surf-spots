import axios from 'axios';
var Promise = require("bluebird");

export const GET_USER_COUNT = 'GET_USER_COUNT';
export const GET_TIME_SPENT_CODING = 'GET_TIME_SPENT_CODING';
export const GET_TIME_SPENT_IN_CLASS = 'GET_TIME_SPENT_IN_CLASS';
export const GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT = 'GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT';
export const GET_SCHEDULE = 'GET_SCHEDULE';

export function getSchedule(token, scheduleId) {
  return {
    type: GET_SCHEDULE,
    payload: axios({
      method: 'get',
      url: `/api/Schedules/${scheduleId}`,
      headers: { Authorization: token }
    })
      .then((res) => res.data)
      .catch((error) => {
        console.log(error)
      })
  };
}

export function getCheckInAndOutTimesByStudent(token, moodleId) {
  return {
    type: GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT,
    payload: axios({
      method: 'post',
      url: '/api/Statements/getStatementsByType',
      headers: { Authorization: token },
      data: {
        type: 'GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT',
        payload: {
          moodleId: moodleId
        }
      }
    }).then((response) => response.data.data)
      .catch((error) => {
        console.log(error)
      })
  }
}

export function getUserCount(token) {
  return {
    type: GET_USER_COUNT,
    payload: axios({
      method: 'get',
      url: '/api/users/count',
      headers: { Authorization: token }
    })
      .then(response => response.data.count)
      .catch((error) => {
        console.log(error)
      })
  };
}

export const getTimeSpentCoding = moodleUserId =>
  ({
    type: GET_TIME_SPENT_CODING,
    payload: axios({
      url: '/api/Statements/getStatementsByType',
      method: 'post',
      data: {
        type: 'WAKATIME_BY_STUDENT_ID',
        payload: [moodleUserId]
      }
    })
      .then(response => response.data.data)
      .catch((error) => {
        console.log(error)
      })
  });

export const getTimeSpentInClass = moodleUserId =>
  ({
    type: GET_TIME_SPENT_IN_CLASS,
    payload: axios({
      url: '/api/Statements/getStatementsByType',
      method: 'post',
      data: {
        type: 'ATTENDANCE_BY_STUDENT_ID',
        payload: { moodleUserId }
      }
    })
      .then(response => response.data.data)
      .catch((error) => {
        console.log(error)
      })
  });
