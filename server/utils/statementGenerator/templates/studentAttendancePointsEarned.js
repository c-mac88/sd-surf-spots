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
      id: 'http://id.tincanapi.com/verb/added',
      display: {
        en: 'added'
      }
    },
    object: {
      id: 'http://activitystrea.ms/schema/1.0/collection',
      definition: {
        type: 'http://activitystrea.ms/schema/1.0/collection',
        name: {
          en: `${studentAttendanceData.points} attendance points`
        },
        extensions: {
          'http://id.tincanapi.com/extension/date': studentAttendanceData.date,
          'http://id.tincanapi.com/extension/reflection': studentAttendanceData.points
        }
      }
    },
    timestamp: new Date()
  });
