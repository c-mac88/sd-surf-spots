module.exports = completeAttendanceData =>
  ({
    actor: {
      name: completeAttendanceData.fullName,
      account: {
        homePage: 'http://lms.origincodeacademy.com',
        name: completeAttendanceData.moodleUserId
      }
    },
    verb: {
      id: 'http://activitystrea.ms/schema/1.0/approve',
      display: {
        en: 'approved'
      }
    },
    object: {
      id: 'http://lms.origincodeacademy.com',
      definition: {
        type: 'http://id.tincanapi.com/activitytype/collection',
        name: {
          en: completeAttendanceData.date
        },
        extensions: {
          'http://id.tincanapi.com/extension/collection-type': 'attendance'
        }
      }
    },
    timestamp: new Date()
  });
