module.exports = wakatimeData =>
  ({
    actor: {
      name: wakatimeData.fullName,
      account: {
        homePage: 'http://lms.origincodeacademy.com',
        name: wakatimeData.moodleUserId
      }
    },
    verb: {
      id: 'http://activitystrea.ms/schema/1.0/created',
      display: {
        en: 'created'
      }
    },
    object: {
      id: 'https://wakatime.com',
      definition: {
        extensions: {
          'http://lrs.learninglocker.net/define/extensions/collection-type': {
            projects: wakatimeData.projects,
            languages: wakatimeData.languages,
            editors: wakatimeData.editors,
            operating_systems: wakatimeData.operating_systems,
            branches: wakatimeData.branches,
            entities: wakatimeData.entities,
            grandTotal: wakatimeData.grandTotal,
            date: wakatimeData.date,
            fullName: wakatimeData.fullName
          }
        },
        type: 'http://id.tincanapi.com/activitytype/collection-simple',
        name: {
          en: 'Hours Spent Coding'
        }
      }
    },
    timestamp: new Date()
  });
