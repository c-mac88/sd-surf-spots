const moment = require('moment');

const timestamp = moment().startOf('day').add(7, 'hours');
module.exports = data => [{
  $match: {
    $and: [{
      $or: [{
        'statement.verb.id': 'http://activitystrea.ms/schema/1.0/checkin'
      },
      {
        'statement.verb.id': 'http://activitystrea.ms/schema/1.0/leave'
      }
      ]
    },
    {
      'statement.actor.account.name': data.moodleUserId
    },
    {
      timestamp: {
        $gt: {
          $dte: timestamp
        }
      }
    }
    ]
  }
}];
