export default function (state = { userCount: 0 }, action = {}) {
  switch (action.type) {
    case 'GET_USER_COUNT_FULFILLED':
      return { ...state, userCount: action.payload };
    case 'GET_USER_COUNT_REJECTED':
      return state;
    case 'GET_TIME_SPENT_CODING_FULFILLED':
      return { ...state, timeSpentCoding: action.payload };
    case 'GET_TIME_SPENT_CODING_REJECTED':
      return state;
    case 'GET_TIME_SPENT_IN_CLASS_FULFILLED':
      return { ...state, timeSpentInClass: action.payload };
    case 'GET_TIME_SPENT_IN_CLASS_REJECTED':
      return state;
    case 'GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT_FULFILLED':
      return { ...state, checkInAndOutTimes: action.payload };
    case 'GET_CHECK_IN_AND_OUT_TIMES_BY_STUDENT_REJECTED':
      return state;
    case 'GET_SCHEDULE_FULFILLED':
      return { ...state, schedule: action.payload.schedule };
    case 'GET_SCHEDULE_REJECTED':
      return state;
    default:
      return state;
  }
}
