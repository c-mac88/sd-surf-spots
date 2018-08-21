module.exports = data => [
  {
    $match: {
      $and: [
        {
          'statement.actor.account.name': data.moodleUserId
        },
        {
          'statement.object.definition.type': 'http://id.tincanapi.com/activitytype/assessment'
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      score: '$statement.result.score.raw',
      title: '$statement.object.definition.name.en',
      durationMinutes: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/duration',
      answers: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/reflection',
      quizId: '$statement.object.id',
      timestamp: 1
    }
  }
];
