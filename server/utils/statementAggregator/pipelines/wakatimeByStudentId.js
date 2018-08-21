module.exports = data =>
  [{
    $match: {
      $and: [
        {
          'statement.object.id': 'https://wakatime.com'
        },
        {
          'statement.actor.account.name': {
            $in: data
          }
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      fullName: '$statement.actor.name',
      moodleUserId: '$statement.actor.account.name',
      projects: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.projects',
      totalSeconds: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.grandTotal.total_seconds',
      date: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.date'
    }
  }];
