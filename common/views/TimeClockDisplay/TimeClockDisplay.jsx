import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Clock from 'react-live-clock';

export default class TimeClockDisplay extends Component {

  componentDidMount() {
    const { connectToSocket, user } = this.props;
    connectToSocket(user);
  }

  render() {
    const { message, attendanceArray, isGreeting, messageTimeOfDay, messageTimeInClass, user } = this.props;
    return (
      <div>
        {user.isAdmin && <div className="time-clock-display container">
          <div className="time-clock-display-date-time row">
            <span>{moment().format('dddd, MMMM Do')}</span>
            <span >
              <Clock
                format={'LTS'}
                ticking
                timezone={'US/Pacific'}
              />
            </span>
          </div>
          <div className="row text-center">
            <div className="col col-xs-12">
              <span className="message-text-main">Hello! Please check in or out</span>
            </div>
          </div>
          <div className="text-center">
            <img className="time-clock-display-logo" src="../img/logo_white.png" alt="logo" />
          </div>
          <div className={['container text-center', isGreeting && 'time-clock-display-message'].join(' ')}>
            <div className="col col-xs-6 col-xs-offset-3">
              { isGreeting && message && <div className="row text-center">
                <span className="message-text">{message}</span>
              </div>}
              { isGreeting && messageTimeInClass &&
                <span className="message-text">{messageTimeInClass}</span>}
              { isGreeting && messageTimeOfDay && <div className="row text-center">
                <span className="message-text">{messageTimeOfDay}</span>
                <br />
                {/* <img src={messageTimeOfDayGif} alt="gif" /> */}
              </div>}
              <br />
            </div>
          </div>
          <div className="attendance-list-and-random-gif container row">
            <div className="col col-xs-12 col-md-6">
              <ul>{attendanceArray.slice(0, 5).map(statement =>
                <li key={`${statement.name}:${statement.timestamp}`}><b>{statement.name}</b> <i>{statement.verb}</i> {statement.location}
                  <span><b>{moment(statement.timestamp).format('LT')}</b></span>
                </li>)}
              </ul>
            </div>
            <div className="col col-xs-12 col-md-6 text-center">
              <img src="http://media.giphy.com/media/3MRZZj6ScR6LK/200.gif" alt="randomCodingGif" />
            </div>
          </div>
        </div>}
        {!user.isAdmin && <h3>You are not authorized to view this page.
          </h3>}
      </div>
    );
  }
}

TimeClockDisplay.propTypes = {
  connectToSocket: PropTypes.func,
  message: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
  attendanceArray: PropTypes.arrayOf(PropTypes.any),
  isGreeting: PropTypes.bool,
  messageTimeOfDay: PropTypes.string,
  messageTimeInClass: PropTypes.string
};
