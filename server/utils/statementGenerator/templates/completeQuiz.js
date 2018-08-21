module.exports = completeQuizData =>
({
  actor: {
    name: completeQuizData.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: completeQuizData.moodleUserId
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
        en: 'Quiz'
      },
      extensions: {
        'http://id.tincanapi.com/extension/id': completeQuizData.courseId,
        'http://id.tincanapi.com/extension/position': completeQuizData.index
      }
    }
  },
  timestamp: new Date()
});
