import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import LineChart from '../Common/Charts/Line';
import BarChart from '../Common/Charts/Bar';
import FilterButton from './FilterButton';
import colorArray from '../Common/ColorArray';
import DayPicker, { DateUtils } from 'react-day-picker';
import Table from './Table'
import 'react-day-picker/lib/style.css';


export default class Attendence extends Component {
    constructor(props) {
        super(props);
        this.months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    setSchedule = (schedule, times) => {
        this.date = this.today()
        this.checkIn = this.getCheckIn(schedule)
        this.checkOut = this.getCheckOut(schedule)
        this.status = this.getStatus(times)
    }

    dayOfWeek = () => {
        return this.days[new Date().getDay()];
    }

    today = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = this.months[today.getMonth()];
        var day = this.dayOfWeek()
        var yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        return day + ' ' + mm + ' ' + dd + ' , ' + yyyy;
    }

    /*
    Finds the specifified checkin time for the student
    */
    getCheckIn = (schedule) => {
        if (schedule) {
            var checkIn = '';
            var dayOfWeek = this.dayOfWeek().toLowerCase()
            //Satuday and Sunday return latter string
            return schedule[dayOfWeek] != undefined ? schedule[dayOfWeek].in : 'You have no Check-in time for today'
        } else {
            return 'You have no Check-in time for today'
        }
    }

    /*
    Finds the specifified checkout time for the student
    */
    getCheckOut = (schedule) => {
        if (schedule) {
            var checkIn = '';
            var dayOfWeek = this.dayOfWeek().toLowerCase()
            //Satuday and Sunday return latter string
            return schedule[dayOfWeek] != undefined ? schedule[dayOfWeek].out : 'You have no Check-out time for today'
        } else {
            return 'You have no Check-out time for today'
        }
    }

    /*
    Returns a status object containing a description (e.i. 'you checked in at 9:12 AM')
    and an action (e.i. 'checkin' or 'checkout')
    */
    getStatus = (times) => {
        var status = {}
        status.description = ''
        status.action = ''
        if (times) {
            var actionTime = new Date(times[0].statement.object.definition.extensions["http://id.tincanapi.com/extension/location"].isoDate)
            var today = new Date().setHours(0, 0, 0, 0);
            if (actionTime > today) {
                if (times[0].statement.verb.id == "http://activitystrea.ms/schema/1.0/checkin") {
                    status.action = 'checkin'
                    status.onSchedule = this.checkStudentTimes('checkin', times)
                    status.description = 'You checked in ' + (status.onSchedule ? 'on time at ' : 'late at ') + actionTime.toLocaleString()
                } else {
                    status.action = 'checkout'
                    status.onSchedule = this.checkStudentTimes('checkout', times)
                    status.description = 'You checked out ' + (status.onSchedule ? 'on time at ' : 'early at ') + actionTime.toLocaleString()
                }
            } else {
                status.description = 'You have not checked in today.'
                status.action = 'none'
            }
        }
        return status
    }

    /*
    The user is prompted that they have checked in late if the 'First' Checkin of the day
    is after the start time for the student.
    However, they are prompted they have checked out early if the 'Last' Checkout of the day
    is before the end time for the student
    */
    checkStudentTimes = (verb, times) => {
        var today = new Date()
        var times = this.checkInTimesForDate(times, new Date())
        var firstCheckin = times[0]
        var lastCheckOut = times[1]
        var scheduledCheckIn = new Date(today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            this.parseScheduletime(this.checkIn))
        var scheduledCheckOut = new Date(today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            this.parseScheduletime(this.checkOut))

        if (verb == 'checkin') {
            return scheduledCheckIn > firstCheckin
        } else {
            return lastCheckOut > scheduledCheckOut
        }
    }

    parseScheduletime = (time) => {
        return time.indexOf(':') > -1 ? Number(time.split(":")[0]) : undefined
    }

    /*
    Takes array of all the checkin and checkout times for a student
    Returns an array with the first checkin date time at index 0
    and the last chekout date time at index 1
    */
    checkInTimesForDate = (times, start) => {
        var checkins = [];
        var checkouts = [];
        start.setHours(0, 0, 0, 0);
        var end = new Date(start.getFullYear(), start.getMonth(), start.getDate()).setHours(23, 59, 59, 999);
        for (var i = 0; i < times.length; i++) {
            var dateOfAction = new Date(times[i].statement.object.definition.extensions["http://id.tincanapi.com/extension/location"].isoDate)
            if (dateOfAction > start && dateOfAction < end) {
                if (times[i].statement.verb.id == "http://activitystrea.ms/schema/1.0/checkin") {
                    checkins.push(dateOfAction)
                } else {
                    checkouts.push(dateOfAction)
                }
            }
        }
        //return (checkins.length > 0 && checkouts.length > 0) ? [checkins[checkins.length - 1], checkouts[0]] : undefined

        if (checkins.length > 0 && checkouts.length > 0){
            return [checkins[checkins.length - 1], checkouts[0]]
        } else if (checkins.length == 0 && checkouts.length == 0) {
            return [ {}, {} ]
        }
        else{
            if ( !!checkins[checkins.length - 1] ){
                return ( [checkins[checkins.length - 1], {} ])
            }
            else{
                return [ {}, checkouts[0] ]
            }
        }
    }


    render() {
        const { schedule, checkInAndOutTimes } = this.props
        this.setSchedule(schedule, checkInAndOutTimes)

        //Set the status bar color
        this.statusColor = this.status.onSchedule ? '#8BC670' : '#FF566F'
        this.statusStyle = {
            fontSize: '25px',
            textAlign: 'center',
            color: '#EBECF0',
            border: '4px #AAB0C0',
            borderRadius: '8px',
            backgroundColor: this.status.action == 'none' ? '#282C34' : this.statusColor
        };

        return (
            <div className="row">
                <div className="chart-container-parent col col-xs-12">
                    <h1 style={{ textAlign: 'center' }}>Daily Check-Ins and Check-Outs</h1>
                    <h2>Today: {this.date}</h2>
                    <h2>Check-in: {moment(this.checkIn, "HH:mm").format("hh:mm A")}</h2>
                    <h2 >Check-out: {moment(this.checkOut, "HH:mm").format("hh:mm A")}</h2>
                    <p style={this.statusStyle} >{this.status.description}</p>
                    {checkInAndOutTimes &&
                        <Table
                            times={checkInAndOutTimes}
                            checkInTimesForDate={this.checkInTimesForDate}
                            parseScheduletime={this.parseScheduletime}
                            schedule={schedule} />}
                </div>
            </div>
        )
    }
}