const extensions = '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type';

module.exports = data =>
  [{
    $match: {
        "$and": [
          {
            "$comment": "{\"criterionLabel\":\"A\",\"criteriaPath\":[\"statement\",\"verb\"]}",
            "$or": [
              {
                "statement.verb.id": "http://activitystrea.ms/schema/1.0/checkin"
              },
              {
                "statement.verb.id": "http://activitystrea.ms/schema/1.0/leave"
              }
            ]
          },
          {
            'statement.actor.account.name': data.moodleId
          }
        ]
      }
  
  }];