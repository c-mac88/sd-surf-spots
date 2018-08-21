module.exports = completeMarkdownData =>
({
  actor: {
    name: completeMarkdownData.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: completeMarkdownData.moodleUserId
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
        en: 'Markdown Lesson'
      },
      extensions: {
        'http://id.tincanapi.com/extension/id': completeMarkdownData.courseId,
        'http://id.tincanapi.com/extension/position': completeMarkdownData.index
      }
    }
  },
  timestamp: new Date()
});
