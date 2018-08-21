export default function (state =
  { timestamp: '', connected: false, joined: false, message: '', attendanceArray: [] }, action = {}) {
  switch (action.type) {
    case 'SET_TIME':
      return { ...state, timestamp: action.payload.timestamp };
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload.connected };
    case 'SET_JOINED_FULFILLED':
      return { ...state, joined: action.payload.joined };
    case 'SET_JOINED_REJECTED':
      return state;
    case 'NEW_SWIPE_FULFILLED':
      return { ...state, message: action.payload.message, openModal: action.payload.openModal };
    case 'NEW_SWIPE_REJECTED':
      return state;
    case 'UPDATE_LIST_FULFILLED':
      return { ...state, attendanceArray: action.payload.attendanceArray };
    case 'UPDATE_LIST_REJECTED':
      return state;
    case 'SET_GREETING':
      return { ...state, isGreeting: action.payload.isGreeting };
    case 'GET_MESSAGE_TIME_OF_DAY_FULFILLED':
      return { ...state, messageTimeOfDay: action.payload.messageTimeOfDay, messageTimeOfDayGif: action.payload.messageTimeOfDayGif };
    case 'GET_MESSAGE_TIME_OF_DAY_REJECTED':
      return state;
    case 'GET_MESSAGE_TIME_IN_CLASS_FULFILLED':
      return { ...state, messageTimeInClass: action.payload.messageTimeInClass };
    case 'GET_MESSAGE_TIME_IN_CLASS_REJECTED':
      return state;
    case 'RESET_MESSAGE_FULFILLED':
      const { message, messageTimeOfDay, messageTimeOfDayGif, messageTimeInClass } = action.payload;
      return { ...state, message, messageTimeOfDay, messageTimeInClass, messageTimeOfDayGif };
    case 'RESET_MESSAGE_REJECTED':
      return state;
    case 'GET_RANDOM_CODING_GIF_FULFILLED':
      return { ...state, randomCodingGif: action.payload.randomCodingGif };
    case 'GET_RANDOM_CODING_GIF_REJECTED':
      return state;
    default:
      return state;
  }
}
