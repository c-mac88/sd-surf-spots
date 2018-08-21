module.exports = courseTimeData =>
({
  actor: {
    name: courseTimeData.fullName,
    account: {
      homePage: 'https://lms.origincodeacademy.com',
      name: courseTimeData.moodleUserId
    }
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/created',
    display: {
      en: 'created'
    }
  },
  object: {
    id: 'https://lms.origincodeacademy.com',
    definition: {
      extensions: {
        'http://lrs.learninglocker.net/define/extensions/collection-type': {

        }
      },
      type: 'http://id.tincanapi.com/activitytype/collection-simple',
      name: {
        en: ''
      }
    }
  },
  timestamp: new Date()
});
