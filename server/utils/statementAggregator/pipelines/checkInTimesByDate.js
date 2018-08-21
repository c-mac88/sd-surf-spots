module.exports = data =>
  [{
    $match: {
      $and: [
        {
          'statement.verb.id': 'http://activitystrea.ms/schema/1.0/checkin'
        },
        {
          timestamp: {
            $gte: {
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
      moodleUserId: '$statement.actor.account.name'
    }
  }];
