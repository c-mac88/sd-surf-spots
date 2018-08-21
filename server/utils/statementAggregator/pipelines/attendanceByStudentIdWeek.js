const moment = require('moment');

const timestamp = moment().startOf('day').subtract(14, 'days');
module.exports = data => [{
  $match: {
    $and: [{
      'statement.verb.id': 'http://activitystrea.ms/schema/1.0/at'
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
}, {
  $project: {
    _id: 0,
    date: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/date',
    start: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/starting-point',
    end: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/ending-point'
  }
}];
