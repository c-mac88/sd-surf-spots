import React, { Component } from 'react';
import cookie from 'react-cookie';
import PropTypes from 'prop-types';
import Attendence from './Attendence'
import TimeCoding from './TimeCoding';
import TimeInClass from './TimeInClass';

export default class Dashboard extends Component {
  componentWillMount() {
    const { user, getUserCount, getTimeSpentCoding, getTimeSpentInClass, getSchedule, getScheduleExists, getCheckInAndOutTimesByStudent } = this.props;
    if (user) cookie.save('x-account-id', user.accountId, { path: '/' });
    if (user.isAdmin) getUserCount(user.token);
    getTimeSpentCoding(user.moodleUserId.toString());
    getTimeSpentInClass(user.moodleUserId.toString());
    getSchedule(user.token.toString(), user.scheduleId.toString());
    getCheckInAndOutTimesByStudent(user.token.toString(), user.moodleUserId.toString());

  }

  render() {
    const mockProfile = { profile: { displayName: 'none' } };
    const { profile } = this.props.user.profiles[0] || mockProfile;
    const { user, userCount, timeSpentCoding, timeSpentInClass, schedule, checkInAndOutTimes } = this.props;
    return (
      <div>
        <h1>Dashboard</h1>
        {user.isAdmin && <div>
          <h2>Current profile is: {profile.displayName} </h2>
          <h2>Current user is: {user.username} </h2>
          <h2>Number of users in system is: {userCount} </h2>
        </div>}
        {schedule && <Attendence schedule={schedule} checkInAndOutTimes={checkInAndOutTimes} />}
        {timeSpentCoding && <TimeCoding timeSpentCoding={timeSpentCoding} />}
        {timeSpentInClass && <TimeInClass timeSpentInClass={timeSpentInClass} />}
      </div>
    );
  }
}

Dashboard.propTypes = {
  getUserCount: PropTypes.func,
  user: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.object,
  ]),
  userCount: PropTypes.number,
  getTimeSpentCoding: PropTypes.func,
  timeSpentCoding: PropTypes.arrayOf(PropTypes.any),
  getTimeSpentInClass: PropTypes.func,
  timeSpentInClass: PropTypes.arrayOf(PropTypes.any)
};
