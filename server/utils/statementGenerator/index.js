const axios = require('axios');
const checkIn = require('./templates/checkIn');
const checkOut = require('./templates/checkOut');
const completeAttendanceDaily = require('./templates/completeAttendanceDaily');
const completeChallenge = require('./templates/completeChallenge');
const completeMarkdown = require('./templates/completeMarkdown');
const completeQuiz = require('./templates/completeQuiz');
const completeScrimba = require('./templates/completeScrimba');
const completeStep = require('./templates/completeStep');
const courseEnrollmentTime = require('./templates/courseEnrollmentTime');
const forumAttendance = require('./templates/forumAttendance');
const project = require('./templates/project');
const quizScore = require('./templates/quizScore');
const studentAttendanceDaily = require('./templates/studentAttendanceDaily');
const studentAttendancePointsEarned = require('./templates/studentAttendancePointsEarned');
const wakatime = require('./templates/wakatime');

const getStatementFromTemplate = (type, statementData) => {
  let newStatement = {};
  switch (type) {
    case 'CHECK_IN':
      newStatement = checkIn(statementData);
      break;
    case 'CHECK_OUT':
      newStatement = checkOut(statementData);
      break;
    case 'COMPLETE_ATTENDANCE_DAILY':
      newStatement = completeAttendanceDaily(statementData);
      break;
    case 'COMPLETE_CHALLENGE':
      newStatement = completeChallenge(statementData);
      break;
    case 'COMPLETE_MARKDOWN':
      newStatement = completeMarkdown(statementData);
      break;
    case 'COMPLETE_QUIZ':
      newStatement = completeQuiz(statementData);
      break;
    case 'COMPLETE_SCRIMBA':
      newStatement = completeScrimba(statementData);
      break;
    case 'COMPLETE_STEP':
      newStatement = completeStep(statementData);
      break;
    case 'COURSE_ENROLLMENT_TIME':
      newStatement = courseEnrollmentTime(statementData);
      break;
    case 'FORUM_ATTENDANCE':
      newStatement = forumAttendance(statementData);
      break;
    case 'PROJECT':
      newStatement = project(statementData);
      break;
    case 'QUIZ_SCORE':
      newStatement = quizScore(statementData);
      break;
    case 'STUDENT_ATTENDANCE_DAILY':
      newStatement = studentAttendanceDaily(statementData);
      break;
    case 'STUDENT_ATTENDANCE_POINTS_EARNED':
      newStatement = studentAttendancePointsEarned(statementData);
      break;
    case 'WAKATIME':
      newStatement = wakatime(statementData);
      break;
    default:
      newStatement = '';
  }
  return JSON.stringify(newStatement);
};

const generateStatement = (type, payload) =>
  axios({
    url: 'http://lrs.origincodeacademy.com/data/xAPI/statements',
    method: 'post',
    auth: {
      username: process.env.LRS_USER,
      password: process.env.LRS_PWD
    },
    headers: {
      'X-Experience-API-Version': '1.0.3',
      'Content-Type': 'application/json'
    },
    data: getStatementFromTemplate(type, payload)
  });

module.exports = { getStatementFromTemplate, generateStatement };
