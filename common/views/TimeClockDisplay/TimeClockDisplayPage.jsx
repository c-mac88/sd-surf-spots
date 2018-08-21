import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TimeClockDisplay from './TimeClockDisplay';
import * as TimeClockDisplayActions from './actions';

function mapStateToProps({ timeClockDisplay, user }) {
  return {
    timestamp: timeClockDisplay.timestamp,
    connected: timeClockDisplay.connected,
    joined: timeClockDisplay.joined,
    message: timeClockDisplay.message,
    attendanceArray: timeClockDisplay.attendanceArray,
    isGreeting: timeClockDisplay.isGreeting,
    messageTimeOfDay: timeClockDisplay.messageTimeOfDay,
    messageTimeOfDayGif: timeClockDisplay.messageTimeOfDayGif,
    gifTimeOfDay: timeClockDisplay.gifTimeOfDay,
    messageTimeInClass: timeClockDisplay.messageTimeInClass,
    randomCodingGif: timeClockDisplay.randomCodingGif,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TimeClockDisplayActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeClockDisplay);
