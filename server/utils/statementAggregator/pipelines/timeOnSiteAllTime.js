module.exports = () =>
  [{
    $match: {
      'statement.verb.id': 'http://activitystrea.ms/schema/1.0/at'
    }
  },
  {
    $project: {
      _id: 0,
      name: '$statement.actor.name',
      date: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/date',
      checkIn: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/starting-point',
      checkOut: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/ending-point'
    }
  }];
