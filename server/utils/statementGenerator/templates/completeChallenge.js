module.exports = completeStepData =>
({
  actor: {
    name: completeStepData.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: completeStepData.moodleUserId
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
      type: 'http://id.tincanapi.com/activitytype/media',
      name: {
        en: 'Code Challenge Assignment'
      },
      extensions: {
        'http://id.tincanapi.com/extension/id': completeStepData.courseId,
        'http://id.tincanapi.com/extension/position': completeStepData.index
      }
    }
  },
  timestamp: new Date()
});
