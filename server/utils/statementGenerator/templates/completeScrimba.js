module.exports = completeScrimbaData =>
({
  actor: {
    name: completeScrimbaData.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: completeScrimbaData.moodleUserId
    }
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/completed',
    display: {
      en: 'completed'
    }
  },
  object: {
    id: 'http://lms.origincodeacademy.com',
    definition: {
      type: 'http://adlnet.gov/expapi/activities/media',
      name: {
        en: 'Scrimba Screencast'
      },
      extensions: {
        'http://id.tincanapi.com/extension/id': completeScrimbaData.courseId,
        'http://id.tincanapi.com/extension/position': completeScrimbaData.index
      }
    }
  },
  timestamp: new Date()
});
