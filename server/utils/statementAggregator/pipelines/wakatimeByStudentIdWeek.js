const moment = require('moment');

const date = moment().subtract(2, 'week').format();
module.exports = data =>
  [{
    $match: {
      $and: [
        {
          'statement.object.id': 'https://wakatime.com'
        },
        {
          'statement.actor.account.name': data
        },
        {
          timestamp: {
            $gte: {
              $dte: date
            }
          }
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      totalSeconds: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.grandTotal.total_seconds',
      date: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.date'
    }
  }];
