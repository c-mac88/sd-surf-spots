import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import codeChallenge from './views/CodeChallenge/reducer';
import code from './views/Code/reducer';
import adminChallenge from './views/AdminChallenge/reducer';
import codeEditor from './views/CodeEditor/reducer';
import timeClockDisplay from './views/TimeClockDisplay/reducer';
import adminCodeEditor from './views/AdminCodeEditor/reducer';
import attendance from './views/Attendance/reducer';
import dashboard from './views/Dashboard/reducer';
import userManagement from './views/UserManagement/reducer';
import userDetails from './views/UserDetails/reducer';
import reportsWakaTimeDetail from './views/ReportsWakaTimeDetail/reducer';
import reportsPerformance from './views/ReportsPerformance/reducer';
import reportsTimeSpentOnSite from './views/ReportsTimeSpentOnSite/reducer';
import forumAttendance from './views/ForumAttendance/reducer';
import grader from './views/Grader/reducer';
import prep from './views/Prep/reducer';
import quiz from './views/Quiz/reducer';
import reportsWakaTimeFull from './views/ReportsWakaTimeFull/reducer';
import reportsWakaTimeByDate from './views/ReportsWakaTimeByDate/reducer';
import reportsPrepCourse from './views/ReportsPrepCourse/reducer';

const reducers = combineReducers({
  form: reduxFormReducer,
  user: (state = {}) => (state),
  routing: routerReducer,
  adminChallenge,
  adminCodeEditor,
  codeChallenge,
  codeEditor,
  code,
  timeClockDisplay,
  attendance,
  userManagement,
  dashboard,
  userDetails,
  reportsWakaTimeDetail,
  reportsPerformance,
  reportsTimeSpentOnSite,
  forumAttendance,
  grader,
  prep,
  quiz,
  reportsWakaTimeFull,
  reportsWakaTimeByDate,
  reportsPrepCourse
});

export default reducers;
