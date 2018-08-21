const _ = require('lodash');
const winston = require('winston');
const moment = require('moment');
require('winston-loggly-bulk');
const statementAggregator = require('../../server/utils/statementAggregator');
const { generateStatement } = require('../../server/utils/statementGenerator/index');
const { generateDropoutScore, getAllDurations } = require('../../server/utils/progress/index');
const { getWakatimeByEmail, sendCommentToHubSpot } = require('../../server/utils/hubspot/index');
const { rules } = require('../../server/utils/attendance');

module.exports = (user) => {
  user.isAdminRole = (userId, cb) => {
    const Role = user.app.models.Role;
    const RoleMapping = user.app.models.RoleMapping;

    Role.findOne({ where: { name: 'admin' } }, (errFindOne, role) => {
      if (errFindOne) cb(null, false);
      if (!_.isEmpty(role)) {
        RoleMapping.find({ where: { roleId: role.id } }, (errFind, allAdmins) => {
          if (errFind) cb(null, false);
          const currentUser = allAdmins.filter(x => x.principalId === userId.toString()); // needs to be truthy
          cb(null, currentUser.length > 0);
        });
      } else {
        cb(null, false);
      }
    });
  };

  user.remoteMethod('isAdminRole', {
    isStatic: true,
    accepts: [
      { arg: 'userId', type: 'string', http: { source: 'query' } }
    ],
    returns: [
      { arg: 'isAdminRole', type: 'boolean' }
    ],
    http: { path: '/isAdminRole', verb: 'get' }
  });

  user.getByScheduleId = (scheduleId, cb) => {
    user.find()
    .then((users) => {
      const returnUsers = users.filter(x => x.scheduleId == scheduleId);
      cb(null, returnUsers);
    })
    .catch(err => cb(err));
  };

  user.remoteMethod('getByScheduleId', {
    isStatic: true,
    accepts: [
      { arg: 'scheduleId', type: 'string', http: { source: 'query' } }
    ],
    returns: [
      { arg: 'students', type: 'array' }
    ],
    http: { path: '/getByScheduleId', verb: 'get' }
  });

  const getAdminByID = x =>
    new Promise((resolve, reject) =>
      user.findById(x.principalId)
        .then(result => resolve(result))
        .catch(error => reject(error)));

  user.getAllAdmins = (cb) => {
    const Role = user.app.models.Role;
    const RoleMapping = user.app.models.RoleMapping;

    Role.findOne({ where: { name: 'admin' } }, (errFindOne, role) => {
      if (errFindOne) cb(null, []);
      if (!_.isEmpty(role)) {
        RoleMapping.find({ where: { roleId: role.id } }, (errFind, allAdmins) => {
          if (errFind) cb(null, false);
          const results = allAdmins.map(getAdminByID);
          Promise.all(results)
            .then(response => cb(null, response))
            .catch((error) => { throw error; });
        });
      } else {
        cb(null, false);
      }
    });
  };

  user.remoteMethod('getAllAdmins', {
    isStatic: true,
    returns: [
      { arg: 'users', type: 'array' }
    ],
    http: { path: '/getAllAdmins', verb: 'get' }
  });

  user.getWakatimeKey = (email, cb) =>
    getWakatimeByEmail(email)
      .catch(err => cb(err));

  user.remoteMethod('getWakatimeKey', {
    isStatic: true,
    accepts: [
      { arg: 'email', type: 'string' }
    ],
    returns: [
      { arg: 'wakatimeApiKey', type: 'string' }
    ],
    http: { path: '/getWakatimeKey', verb: 'get' }
  });

  user.sendCommentToHubSpot = (data, cb) => {
    return sendCommentToHubSpot(data)
      .catch(err => cb(err));
  }

  user.remoteMethod('sendCommentToHubSpot', {
    isStatic: true,
    accepts: [
      { arg: 'data', type: 'object', http: { source: 'body' } }
    ],
    returns: [
      { arg: 'hubspotCommentSent', type: 'boolean' }
    ],
    http: { path: '/sendCommentToHubSpot', verb: 'post' }
  });

  user.swipe = (id, building, room, dow, isoDate, cb) => {
    if (!id) {
      const err = new Error('failure');
      err.statusCode = 400;
      cb(err);
    }
    // find student based on barcode Id sent from scanner
    user.findOne({ where: { moodleUserId: id } })
      .then((student) => {
        if (!student) {
          const err = new Error('failure');
          err.statusCode = 404;
          throw err;
        }
        // set the statement type to 'check in' or 'check out' based on student record inClass
        const type = student.inClass ? 'CHECK_OUT' : 'CHECK_IN';
        // if they are in class, set them out of class and save record
        student.inClass = !student.inClass;
        student.save();
        const swipeStatement = {
          fullName: student.fullName,
          id,
          building,
          room,
          dow,
          isoDate
        };
        return generateStatement(type, swipeStatement)
          .then((res) => {
            if (res.data[0]) cb(null, 'success');
          })
          .catch(err => cb(err));
      })
      .catch(err => cb(err));
  };

  user.remoteMethod('swipe', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'building', type: 'string' },
      { arg: 'room', type: 'string' },
      { arg: 'dow', type: 'string' },
      { arg: 'isoDate', type: 'string' }
    ],
    returns: [
      { arg: 'status', type: 'string' }
    ],
  });

  user.attendForum = (forumName, forumStudents, forumDate, cb) => {
    const results = forumStudents.students.map((student) => {
      const forumAttendanceStatement = {
        forumName,
        fullName: student.fullName,
        moodleUserId: student.moodleUserId,
        forumDate
      };
      return generateStatement('FORUM_ATTENDANCE', forumAttendanceStatement)
        .then(res => res.data[0])
        .catch(err => err);
    });
    Promise.all(results)
      .then(response => cb(null, response))
      .catch(error => cb(null, error));
  };

  user.remoteMethod('attendForum', {
    accepts: [
      { arg: 'forumName', type: 'string' },
      { arg: 'forumStudents', type: 'object' },
      { arg: 'forumDate', type: 'date' }
    ],
    returns: [
      { arg: 'data', type: 'object' }
    ],
  });

  user.getDropoutScores = (cb) => {
    user.find({}, (err, data) => {
      generateDropoutScore(data)
        .then(results => cb(null, results))
        .catch((errorGetDropoutScores) => {
          winston.log('error',
            `Progress - getDropoutScores failed. Error msg: ${errorGetDropoutScores}`);
          cb(null, errorGetDropoutScores);
        });
    });
  };

  user.remoteMethod('getDropoutScores', {
    isStatic: true,
    description: 'Requests all calculated dropout scores for students',
    accepts: [],
    returns: [
      { arg: 'progress', type: 'object' }
    ],
    http: { path: '/getDropoutScores', verb: 'get' }
  });

  user.getDurations = cb => user.find({})
      .then(userData => getAllDurations(userData))
      .catch((err) => {
        winston.log('error', `Progress - getAllDurations failed. Error msg: ${err}`);
        cb(null, err);
      });

  user.remoteMethod('getDurations', {
    http: { path: '/getAllDurations', verb: 'get' },
    returns: [
      { arg: 'data', type: 'array' }
    ],
    description: [
      'Finds all enrollment periods for students'
    ]
  });

  user.attendanceScore = (moodleUserId, cb) => {
    let totalScore = 0;
    let totalCredits = 0;
    let totalPoints = 0;
    let totalHours = 0;
    let minHours = Number.MAX_VALUE;
    let maxHours = Number.MIN_VALUE;
    let scheduledTimeStart;
    let scheduledTimeEnd;

    user.findOne({ where: { moodleUserId } })
      .then((data) => {
        const studentType = data.studentType;

        if (studentType === 'FULL') {
          scheduledTimeStart = rules.fullTime.timeStart;
          scheduledTimeEnd = rules.fullTime.timeEnd;
        } else {
          scheduledTimeStart = rules.partTime.timeStart;
          scheduledTimeEnd = rules.partTime.timeEnd;
        }

        statementAggregator('ATTENDANCE_BY_STUDENT_ID', { moodleUserId })
          .then((response) => {
            const rawData = response.data;
            const fullName = rawData[0].fullName;
            const transactions = rawData.map((entry) => {
              const date = new Date(entry.date);
              const day = date.getDay();
              const isWeekend = day === 0 || day === 6;
              const timeStart = moment(entry.start, 'h:mm a');
              const timeEnd = moment(entry.end, 'h:mm a');
              const timeNormalStart = moment(scheduledTimeStart, 'h:mm a');
              const timeNormalEnd = moment(scheduledTimeEnd, 'h:mm a');
              const diffStart = timeStart.diff(timeNormalStart, 'm');
              const diffEnd = timeNormalEnd.diff(timeEnd, 'm');
              const duration = Number((timeEnd.diff(timeStart, 'm')/60).toFixed(2));
              let credits = 0;
              let points = 0;

              if (!isWeekend) {
                if (diffStart > 60) {
                  points += rules.points.arriveLate.moreThanHour;
                } else if (diffStart > 30) {
                  points += rules.points.arriveLate.lessThanHour;
                }

                if (diffEnd > 60) {
                  points += rules.points.leaveEarly.moreThanHour;
                } else if (diffEnd > 30) {
                  points += rules.points.leaveEarly.lessThanHour;
                }
              }

              points = points < 1 ? points : 1;
              totalPoints += points;
              totalScore = totalPoints - totalCredits;
              totalHours += duration;

              const transaction = {
                date: new Date(entry.date).toISOString().substr(0, 10),
                durationHours: duration,
                start: entry.start,
                end: entry.end,
                weekend: isWeekend,
                credits,
                points
              };

              // Find min & max
              if (duration < minHours) {
                minHours = duration;
              } 
              if (duration > maxHours) {
                maxHours = duration;
              }

              return transaction;
            });

            const alertLevel = totalScore >= rules.dangerPoints ?
              'danger' :
              totalScore >= rules.warningPoints ?
              'warning' : 'OK';

            totalHours = Number(totalHours.toFixed(2));
            const averageHours = Number((totalHours / transactions.length).toFixed(2));
            const returnData = {
              moodleUserId,
              fullName,
              totalHours,
              totalScore,
              totalPoints,
              totalCredits,
              averageHours,
              minHours,
              maxHours,
              alertLevel,
              transactions
            };

            cb(null, returnData);
          })
          .catch(err => cb(err));
      });
  };

  user.remoteMethod('attendanceScore', {
    isStatic: true,
    description: [
      'given a student id get attendance score and running details of transactions from the LRS'
    ],
    accepts: [
      { arg: 'moodleUserId', type: 'string', required: true }
    ],
    returns: [
      { arg: 'data', type: 'object' }
    ],
    http: { path: '/attendanceScore', verb: 'get' }
  });

  user.observe('after save', (ctx, next) => {
    const isKey = _.get(ctx, 'instance.wakatimeApiKey', false);
    if (isKey == false) {
      // get user's wakatime attempt to update users wakatime
      getWakatimeByEmail(ctx.instance.email)
        .then((key) => {
          ctx.instance.updateAttributes({ wakatimeApiKey: key, dateUpdated: new Date() });
          next();
        })
        .catch((saveErr) => {
          console.log(saveErr);
        });
    } else {
      ctx.instance.updateAttributes({ dateUpdated: new Date() });
      next();
    }
  });

  user.on('resetPasswordRequest', (info) => {
    const url = `http://${process.env.HOST_NAME}/resetPassword`;
    const html = `<h1>Password Recovery</h1>
                  <p>If you requested to reset your password, follow the link below.</p>
                  <p>Otherwise, you can ignore this message.</p>
                  <p>Click <a href="${url}?access_token=${info.accessToken.id}">here</a> to reset your password.</p>
                  <p>Thanks!</p>
                  <p>-The Team at Origin Code Academy</p>`;
    user.app.models.Email.send({
      to: info.email,
      from: process.env.ADMIN_EMAIL,
      subject: 'Password Reset Request',
      html
    }, (err) => {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
      return true;
    });
  });
};
