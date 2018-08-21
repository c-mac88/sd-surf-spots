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
      type: 'http://id.tincanapi.com/activitytype/step',
      name: {
        en: completeStepData.challengeName
      },
      extensions: {
        'http://id.tincanapi.com/extension/id': completeStepData.challengeId,
        'http://id.tincanapi.com/extension/topic': completeStepData.assignmentId,
        'http://id.tincanapi.com/extension/duration': completeStepData.duration
      }
    }
  },
  timestamp: new Date()
});
