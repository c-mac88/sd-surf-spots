module.exports = data =>
  [{
    $match: {
      $and: [
        {
          'statement.verb.id': 'http://activitystrea.ms/schema/1.0/at'
        },
        {
          'statement.actor.account.name': data.moodleUserId
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      fullName: '$statement.actor.name',
      moodleUserId: '$statement.actor.account.name',
      date: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/date',
      duration: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/duration',
      start: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/starting-point',
      end: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/ending-point'
    }
  }];
