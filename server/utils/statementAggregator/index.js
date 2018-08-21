const axios = require('axios');
const assignmentByStatementId = require('./pipelines/assignmentByStatementId');
const attendanceAfterDate = require('./pipelines/attendanceAfterDate');
const attendanceByStudentId = require('./pipelines/attendanceByStudentId');
const attendanceByStudentIdToday = require('./pipelines/attendanceByStudentIdToday');
const attendanceByStudentIdWeek = require('./pipelines/attendanceByStudentIdWeek');
const attendancePointsByStudentId = require('./pipelines/attendancePointsByStudentId');
const attendanceToday = require('./pipelines/attendanceToday');
const checkInAndOutTimesByStudent = require('./pipelines/checkInAndOutTimesByStudent');
const checkInTimesByDate = require('./pipelines/checkInTimesByDate');
const durations = require('./pipelines/durations');
const lastAttendanceStatement = require('./pipelines/lastAttendanceStatement');
const loginToMoodle = require('./pipelines/loginToMoodle');
const stepByStatementId = require('./pipelines/stepByStatementId');
const timeOnSiteAllTime = require('./pipelines/timeOnSiteAllTime');
const timeOnSiteByDate = require('./pipelines/timeOnSiteByDate');
const wakatime = require('./pipelines/wakatime');
const wakatimeByDate = require('./pipelines/wakatimeByDate');
const wakatimeByStudentId = require('./pipelines/wakatimeByStudentId');
const wakatimeByStudentIdWeek = require('./pipelines/wakatimeByStudentIdWeek');
const wakatimeFull = require('./pipelines/wakatimeFull');
const quizResultsByStudent = require('./pipelines/quizResultsByStudent');

module.exports = (type, data) => {
  let pipeline = [];
  switch (type) {
    case 'ASSIGNMENT_BY_STATEMENT_ID':
      pipeline = assignmentByStatementId(data);
      break;
    case 'ATTENDANCE_AFTER_DATE':
      pipeline = attendanceAfterDate(data);
      break;
    case 'ATTENDANCE_BY_STUDENT_ID':
      pipeline = attendanceByStudentId(data);
      break;
    case 'ATTENDANCE_BY_STUDENT_ID_TODAY':
      pipeline = attendanceByStudentIdToday(data);
      break;
    case 'ATTENDANCE_BY_STUDENT_ID_WEEK':
      pipeline = attendanceByStudentIdWeek(data);
      break;
    case 'ATTENDANCE_POINTS_BY_STUDENT_ID':
      pipeline = attendancePointsByStudentId(data);
      break;
    case 'ATTENDANCE_TODAY':
      pipeline = attendanceToday();
      break;
    case 'DURATIONS':
      pipeline = durations(data);
      break;
    case 'LAST_ATTENDANCE_STATEMENT':
      pipeline = lastAttendanceStatement();
      break;
    case 'LOGIN_TO_MOODLE':
      pipeline = loginToMoodle(data);
      break;
    case 'GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT':
      pipeline = checkInAndOutTimesByStudent(data);
      break;
    case 'GET_ALL_WAKATIME_FULL':
      pipeline = wakatimeFull(data);
      break;
    case 'GET_CHECK_INS_BY_DATE':
      pipeline = checkInTimesByDate(data);
      break;
    case 'STEP_BY_STATEMENT_ID':
      pipeline = stepByStatementId(data);
      break;
    case 'TIME_ON_SITE_ALL_TIME':
      pipeline = timeOnSiteAllTime();
      break;
    case 'TIME_ON_SITE_BY_DATE':
      pipeline = timeOnSiteByDate(data);
      break;
    case 'WAKATIME':
      pipeline = wakatime();
      break;
    case 'WAKATIME_BY_DATE':
      pipeline = wakatimeByDate(data);
      break;
    case 'WAKATIME_BY_STUDENT_ID':
      pipeline = wakatimeByStudentId(data);
      break;
    case 'WAKATIME_WEEK_BY_STUDENT_ID':
      pipeline = wakatimeByStudentIdWeek(data);
      break;
    case 'QUIZ_RESULTS_BY_STUDENT':
      pipeline = quizResultsByStudent(data);
      break;
    default:
      pipeline = '';
  }

  pipeline = encodeURIComponent(JSON.stringify(pipeline));

  return axios({
    url: `http://lrs.origincodeacademy.com/api/statements/aggregate?cache=false&maxTimeMS=5000&maxScan=10000&pipeline=${pipeline}`,
    method: 'get',
    auth: {
      username: process.env.LRS_USER,
      password: process.env.LRS_PWD
    }
  });
};
