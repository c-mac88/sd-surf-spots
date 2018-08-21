module.exports = () =>
  [{
    $match: {
      $and: [
        {
          'statement.verb.id': 'http://activitystrea.ms/schema/1.0/approve'
        },
        {
          'statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/collection-type': 'attendance'
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      date: '$statement.object.definition.name.en'
    }
  }];
