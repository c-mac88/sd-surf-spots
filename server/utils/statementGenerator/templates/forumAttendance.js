module.exports = forumAttendanceData =>
  ({
    actor: {
      name: forumAttendanceData.fullName,
      account: {
        homePage: 'http://lms.origincodeacademy.com',
        name: forumAttendanceData.moodleUserId
      }
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/attended',
      display: {
        en: 'attended'
      }
    },
    object: {
      id: 'http://lms.origincodeacademy.com',
      definition: {
        type: 'http://id.tincanapi.com/activitytype/discussion',
        name: {
          en: forumAttendanceData.forum
        }
      }
    },
    context: {
      instructor: {
        objectType: 'Agent',
        name: forumAttendanceData.instructorName,
        account: {
          name: forumAttendanceData.instructorMoodleUserId,
          homePage: 'http://lms.origincodeacademy.com'
        }
      }
    },
    timestamp: forumAttendanceData.date
  });
