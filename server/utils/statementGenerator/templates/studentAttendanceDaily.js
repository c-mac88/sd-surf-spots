module.exports = studentAttendanceData =>
  ({
    actor: {
      name: studentAttendanceData.fullName,
      account: {
        homePage: 'http://lms.origincodeacademy.com',
        name: studentAttendanceData.moodleUserId
      }
    },
    verb: {
      id: 'http://activitystrea.ms/schema/1.0/at',
      display: {
        en: 'was at'
      }
    },
    object: {
      id: 'http://lms.origincodeacademy.com',
      definition: {
        type: 'http://activitystrea.ms/schema/1.0/place',
        name: {
          en: 'Origin Code Academy'
        },
        extensions: {
          'http://id.tincanapi.com/extension/starting-point': studentAttendanceData.checkedIn,
          'http://id.tincanapi.com/extension/ending-point': studentAttendanceData.checkedOut,
          'http://id.tincanapi.com/extension/duration': studentAttendanceData.total,
          'http://id.tincanapi.com/extension/date': studentAttendanceData.date
        }
      }
    },
    timestamp: new Date()
  });
