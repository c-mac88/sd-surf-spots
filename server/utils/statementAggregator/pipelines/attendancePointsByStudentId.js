module.exports = data =>
  [{
    $match: {
      $and: [
        {
          'statement.object.id': 'http://activitystrea.ms/schema/1.0/collection'
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
      points: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/reflection',
      date: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/date',
    }
  }];
