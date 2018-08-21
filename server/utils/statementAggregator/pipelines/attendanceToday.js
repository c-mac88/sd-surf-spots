const localDate = new Date().toLocaleDateString();
const date = new Date(localDate);
module.exports = () =>
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
              $dte: date.toISOString().substring(0, 10)
            }
          }
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      name: '$statement.actor.name',
      verb: '$statement.verb.display.en',
      location: '$statement.object.definition.name.en',
      timestamp: '$statement.timestamp'
    }
  }];
