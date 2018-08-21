import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

class Table extends Component {
  /*
  Return an array of objects the length of the 14 representing the last 14 days.
  Objects will contain the date object
  */
  getLast14Days = (times) => {
    var arr = []
    for (var i = 0; arr.length < 14; i++) {
      var obj = {}
      var date = new Date()
      date.setDate(date.getDate() - i)
      obj.date = date
      //Skip the weekends
      if (date.getDay() > 0 && date.getDay() < 6) {
        arr.push(obj)
      }
    }
    return arr
  }

  /*
  Add the check in and check out times to the day object 
  inside of the days array.
  */
  addTimes = (times, days, fn) => {
    for (var i = 0; i < days.length; i++) {
      var checkInTimes = fn(times, days[i].date)
      days[i].checkIn = checkInTimes ? checkInTimes[0] : 'None'
      days[i].checkOut = checkInTimes ? checkInTimes[1] : 'None'
    }
  }

  /*
  For every day of the last 14 weekdays, check if the check in time is before 
  the scheduled time to check in and if the checkout time is after the scheduled 
  checkout time.
  */
  checkTimes = (days, schedule, parseScheduletime) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var scheduledCheckIn = (date) => {
      //Grab the checkin time for that date
      var dayOfWeek = daysOfWeek[date.getDay()];
      var checkInTime = parseScheduletime(schedule[dayOfWeek].in)
      var scheduledCheckIn = new Date(date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        checkInTime)
      return scheduledCheckIn
    }

    var scheduledCheckOut = (date) => {
      //Grab the checkout time for that date
      var dayOfWeek = daysOfWeek[date.getDay()];
      var checkOutTime = parseScheduletime(schedule[dayOfWeek].out)
      var scheduledCheckOut = new Date(date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        checkOutTime)
      return scheduledCheckOut
    }

    for (var day of days) {
      if (day.checkIn < scheduledCheckIn(day.date) && day.checkOut > scheduledCheckOut(day.date)) {
        day.onSchedule = 'YES'
      } else {
        day.onSchedule = 'NO'
      }
    }
  }


  render() {
    const { times, schedule, checkInTimesForDate, parseScheduletime } = this.props
    var days = this.getLast14Days()
    this.addTimes(times, days, checkInTimesForDate)
    this.checkTimes(days, schedule, parseScheduletime)
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>On Schedule</th>
          </tr>
        </thead>
        <tbody>
          {days.map((time, ndx) => { return (<Row key={ndx} time={time} />) })}
        </tbody>
      </table>
    )
  }
}

export default Table;

Table.propTypes = {
  times: PropTypes.oneOfType([
    PropTypes.array
  ]),
  schedule: PropTypes.object,
  checkInTimesForDate: PropTypes.func,
  parseScheduletime: PropTypes.func
};