module.exports = quizScoreData =>
({
  actor: {
    name: quizScoreData.user.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: quizScoreData.user.moodleUserId
    }
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/completed',
    display: {
      en: 'completed'
    }
  },
  object: {
    id: `http://startnow.origincodeacademy.com/api/Quizzes/${quizScoreData.quiz.id}`,
    definition: {
      type: 'http://id.tincanapi.com/activitytype/assessment',
      name: {
        en: quizScoreData.quiz.title
      },
      extensions: {
        'http://id.tincanapi.com/extension/duration': quizScoreData.result.duration,
        'http://id.tincanapi.com/extension/reflection': quizScoreData.quiz.answers
      }
    }
  },
  result: {
    score: {
      raw: quizScoreData.result.score
    },
    completion: true
  },
  authority: {
    objectType: 'Agent',
    name: 'Jeeves',
    mbox: 'mailto:jeeves@origincodeacademy.com'
  },
  timestamp: new Date()
});
