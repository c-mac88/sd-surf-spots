module.exports = data =>
  [{
    $match: {
      $and: [
        {
          $or: [
            {
              'statement.verb.id': 'http://activitystrea.ms/schema/1.0/leave'
            },
            {
              'statement.verb.id': 'http://activitystrea.ms/schema/1.0/checkin'
            }
          ]
        },
        {
          timestamp: {
            $gt: {
              $dte: data.date
            }
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
      verb: '$statement.verb.display.en',
      timestamp: '$statement.timestamp'
    }
  }];
