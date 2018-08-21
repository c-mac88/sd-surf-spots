import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Navbar extends Component {
  render() {
    const { user } = this.props;

    let items = null;
    if (user.isAdmin && _.get(user, 'studentType', '') !== 'PREP') {
      items = (<ul className="nav navbar-nav navbar-right">
        <li><a href="/auth/account#/">Dashboard</a></li>
        <li><a rel="noopener noreferrer" target="_blank" href="/explorer">Explorer</a></li>
        <li className="dropdown">
          <a className="dropbtn">Challenge</a>
          <div className="dropdown-content">
            <a href="/auth/account#/challenge">Challenge</a>
            <a href="/auth/account#/adminChallenge">Challenge Editor</a>
          </div>
        </li>
        <li className="dropdown">
          <a className="dropbtn">Reports</a>
          <div className="dropdown-content">
            <a href="#/reportsWakaTimeFull">Wakatime Full</a>
            <a href="#/reportsWakaTimeByDate">Wakatime By Date</a>
            <a href="#/reportsTimeSpentOnSite">Time On-Site</a>
            <a href="#/reportsPerformance">Performance</a>
            <a href="#/reportsPrepCourse">Prep Course</a>
            <a href="#/reportsTimeSpentOnSite">Time On-Site</a>
            <a href="#/reportsWakaTimeByDate">Wakatime By Date</a>
            <a href="#/reportsWakaTimeFull">Wakatime Full</a>
          </div>
        </li>
        <li><a href="/auth/account#/grader">Grader</a></li>
        <li><a href="/auth/account#/attendance">Attendance</a></li>
        <li><a href="/auth/account#/users">Users</a></li>
        <li><a href="/auth/account#/quiz">Quiz</a></li>
        <li><a href="/auth/account#/account">My Account</a></li>
        <li><a href="/auth/logout">Log Out</a></li>
      </ul>);
    } else if (_.get(user, 'studentType', '') === 'PREP') {
      items = (<ul className="nav navbar-nav navbar-right">
        <li>
          <a rel="noopener noreferrer" target="_blank" href="https://origincodeacademyprep.slack.com">
            Slack Channel
          </a></li>
        <li><a href="/auth/account#/account">My Account</a></li>
        <li><a href="/auth/prepLogout">Log Out</a></li>
      </ul>);
    } else {
      items = (<ul className="nav navbar-nav navbar-right">
        <li><a href="/auth/account#/quiz">Quiz</a></li>
        <li><a href="/auth/account#/account">My Account</a></li>
        <li><a href="/auth/logout">Log Out</a></li>
      </ul>);
    }
    return (
      <nav role="navigation" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span></button>
            {user.studentType !== 'PREP' && <a href="/" className="navbar-brand"><svg width="40" height="27"><g fill="#FFF" fillRule="evenodd"><path d="M29.3 14.6v5.1l-9.4 3.7-9.4-3.7v-5.2l-2.8-1.2v7.4c0 .6.3 1.2.9 1.4l10.8 4.3.5.1.6-.1 10.8-4.3c.6-.2 1-.8 1-1.4v-7.4l-3 1.3"/><path d="M23.5 15a1.5 1.5 0 0 1-.5-2.8l11.2-4.7L23 2.8a1.5 1.5 0 0 1 1-2.7l14.5 6a1.5 1.5 0 0 1 0 2.8l-14.5 6-.6.1M16 15l-.5-.1-14.6-6A1.5 1.5 0 0 1 1 6l14.6-6a1.5 1.5 0 1 1 1 2.7L5.4 7.5l11.3 4.7c.7.3 1.1 1.1.8 1.9-.2.6-.8 1-1.4 1" /></g></svg></a>}
            {user.studentType === 'PREP' && <a href="/auth/account" className="navbar-brand"><svg width="40" height="27"><g fill="#FFF" fillRule="evenodd"><path d="M29.3 14.6v5.1l-9.4 3.7-9.4-3.7v-5.2l-2.8-1.2v7.4c0 .6.3 1.2.9 1.4l10.8 4.3.5.1.6-.1 10.8-4.3c.6-.2 1-.8 1-1.4v-7.4l-3 1.3"/><path d="M23.5 15a1.5 1.5 0 0 1-.5-2.8l11.2-4.7L23 2.8a1.5 1.5 0 0 1 1-2.7l14.5 6a1.5 1.5 0 0 1 0 2.8l-14.5 6-.6.1M16 15l-.5-.1-14.6-6A1.5 1.5 0 0 1 1 6l14.6-6a1.5 1.5 0 1 1 1 2.7L5.4 7.5l11.3 4.7c.7.3 1.1 1.1.8 1.9-.2.6-.8 1-1.4 1" /></g></svg></a>}
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            {items}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object
  ])
};
