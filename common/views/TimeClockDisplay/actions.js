import axios from 'axios';
import openSocket from 'socket.io-client';

export const SET_TIME = 'SET_TIME';
export const SET_CONNECTED = 'SET_CONNECTED';
export const SET_JOINED = 'SET_JOINED';
export const NEW_SWIPE = 'NEW_SWIPE';
export const RESET_MESSAGE = 'RESET_MESSAGE';
export const UPDATE_LIST = 'UPDATE_LIST';
export const SET_GREETING = 'SET_GREETING';
export const GET_MESSAGE_TIME_OF_DAY = 'GET_MESSAGE_TIME_OF_DAY';
export const GET_MESSAGE_TIME_IN_CLASS = 'GET_MESSAGE_TIME_IN_CLASS';
export const GET_RANDOM_CODING_GIF = 'GET_RANDOM_CODING_GIF';

let attendanceArray = [];

const gifKeywordsUrl = 'https://codepen.io/c-mac88/pen/ZxKJor.js';
const greetingsUrl = 'https://codepen.io/c-mac88/pen/RMVZBN.js';

// get the url of a random gif from giphy based on a keyword
// with a fixed height of 200px
const getRandomGifByTagFH = tag =>
  axios.get(`/api/Proxies/getRandomGifByTagFH/${tag}`)
  .then(res => ({ url: res.data.url }));

// connected and authenticated to socket
export function setConnected() {
  return {
    type: SET_CONNECTED,
    payload: { connected: true }
  };
}

// joined socket room
export function setJoined(status) {
  return {
    type: SET_JOINED,
    payload: new Promise((resolve) => {
      resolve(status);
    })
    .then(joined => ({ joined }))
  };
}

// the student is being greeted or not
export function setGreeting(isGreeting) {
  return {
    type: SET_GREETING,
    payload: { isGreeting }
  };
}

let tags;
let needToRefreshCodingTerms = false;

// signal that we need to refresh the coding terms from the code pen fixture
export function resetKeywordRefresh() {
  needToRefreshCodingTerms = true;
  return true;
}

const getRandomCodingTag = () =>
  new Promise(async (resolve) => {
    if (!!tags && tags.length > 0) {
      if (needToRefreshCodingTerms) {
        const response = await axios.get(gifKeywordsUrl);
        tags = response.data;
        const tag = tags[Math.floor(Math.random() * tags.length)];
        resolve(tag);
        needToRefreshCodingTerms = false;
      } else {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        resolve(tag);
      }
    } else {
      const response = await axios.get(gifKeywordsUrl);
      tags = response.data;
      const tag = tags[Math.floor(Math.random() * tags.length)];
      resolve(tag);
    }
  });

export const getRandomCodingGif = () =>
  ({
    type: GET_RANDOM_CODING_GIF,
    payload: new Promise((resolve) => {
      getRandomCodingTag()
      .then((tag) => {
        getRandomGifByTagFH(tag)
        .then((gif) => {
          resolve(gif.url);
        })
        .catch((err) => { if (!err) resolve('http://media.giphy.com/media/3MRZZj6ScR6LK/200.gif'); });
      });
    })
    .then(randomCodingGif => ({ randomCodingGif }))
  });

// reset all messages
export const resetMessage = () =>
  ({
    type: RESET_MESSAGE,
    payload: new Promise((resolve) => {
      resolve({
        message: '',
        messageTimeOfDay: null,
        messageTimeInClass: null,
        messageTimeOfDayGif: null,
      })
    .then(response => response);
    })
  });

// get the message based on if they are clocking in/out
// and based on the time of day, ie. if they are early, on time, late
export const getMessageTimeOfDay = () =>
  ({
    type: GET_MESSAGE_TIME_OF_DAY,
    payload: new Promise((resolve) => {
      axios.get(greetingsUrl)
      .then((res) => {
        const keywords = res.data;
        const tag = keywords[Math.floor(Math.random() * keywords.length)];
        resolve({ message: tag, gif: '' });
        // getRandomGifByTagFW(tag)
        // .then((gif) => {
        //   resolve({ message: tag, gif: gif.url });
        // })
        // .catch((err) => { if (!err) resolve({ message: res, gif: 'http://media.giphy.com/media/3MRZZj6ScR6LK/200.gif' }); });
      });
    })
    .then(res => ({ messageTimeOfDay: res.message, messageTimeOfDayGif: res.gif }))
  });

// get the length of time student spent in class based on the matching
// check-in statement in the statements array in state
export const getMessageTimeInClass = statement =>
  ({
    type: GET_MESSAGE_TIME_IN_CLASS,
    payload: new Promise((resolve) => {
      const student = statement.response.actor.name;
      const checkOutDate = new Date(statement.response.timestamp);
      const checkInStatement =
        attendanceArray.find(x => x.verb === 'checked in to' && x.name === student);
      if (!!checkInStatement) {
        const checkInDate = new Date(checkInStatement.timestamp);
        const duration = (checkOutDate.getTime() - checkInDate.getTime()) / 1000 / 60 / 60;
        const message = `You spent ${duration.toFixed(2)} hours in class today!`;
        resolve(message);
      } else {
        resolve('See ya next time!');
      }
    })
    .then(messageTimeInClass => ({ messageTimeInClass }))
  });

// show the attendance list after one second
const showAttendanceList = (dispatch, timeout) =>
  setTimeout(() => {
    dispatch(resetMessage())
    .then((res) => {
      if (res) {
        // dispatch(getRandomCodingGif())
        // .then((response) => { if (!!response) dispatch(setGreeting(false)); });
        dispatch(setGreeting(false));
      }
    });
  }, timeout);

// trigger the message sequence to display to students
// based on if they are checking in or out
export const newSwipe = (dispatch, statement) => {
  dispatch(setGreeting(true));
  const greeting =
  statement.response.verb.display.en === 'checked in to' ? 'WELCOME' : 'GOODBYE';
  const student = statement.response.actor.name;
  return {
    type: NEW_SWIPE,
    payload: new Promise((resolve) => {
      // figure out if they are checking in or out
      if (greeting === 'WELCOME') {
        // ***** CHECK IN ***** \\
        dispatch(getMessageTimeOfDay('IN', statement.response.timestamp))
        .then((res) => { if (!!res) showAttendanceList(dispatch, 5000); });
      } else {
        // ***** CHECK OUT ***** \\
        dispatch(getMessageTimeOfDay('OUT', statement.response.timestamp))
        .then((response) => {
          if (response) {
            // after two more seconds, show the time spent in class message
            dispatch(getMessageTimeInClass(statement))
            .then((res) => { if (!!res) showAttendanceList(dispatch, 5000); });
          }
        });
      }
      resolve({ message: `${greeting} ${student}` });
    })
    .then(response => response)
  };
};

// get all statements about check in/out for the day
export const updateList = () =>
  ({
    type: UPDATE_LIST,
    payload: axios({
      url: '/api/Statements/getStatementsByType',
      method: 'post',
      data: {
        type: 'ATTENDANCE_TODAY'
      }
    })
      .then((response) => {
        attendanceArray = response.data.data;
        return { attendanceArray };
      })
  });

// open the connection
// set connected
// dispatch actions when student swipes or when time is being updated
export const connectToSocket = (user) => {
  const socket = openSocket();
  const id = user.token;
  const userId = user.id;
  return (dispatch) => {
    socket.on('connect', () => {
      socket.emit('authentication', { id, userId });
      socket.on('authenticated', () => {
        dispatch(setConnected());
        // join the timeClockDisplay room
        socket.emit('action', { type: 'JOIN_ROOM', payload: 'timeClockDisplay' });
        socket.on('roomJoined', (joined) => {
          if (joined) {
            dispatch(setJoined(true))
            .then((response) => { if (!!response) dispatch(updateList()); });
          }
        });
        socket.on('newSwipe', (statement) => {
          dispatch(newSwipe(dispatch, statement))
          .then((response) => { if (!!response) dispatch(updateList()); });
        });
      });
    });
  };
};
