const extensions = '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type';

module.exports = filterData =>
  [{
    $match: {
        "$and": [
            {
              "$comment": "{\"criterionLabel\":\"B\",\"criteriaPath\":[\"timestamp\"]}",
              "timestamp": {
                "$gte": {
                  "$dte": filterData.date
                }
              }
            },
            {
              "$comment": "{\"criterionLabel\":\"C\",\"criteriaPath\":[\"statement\",\"verb\"]}",
              "$or": [
                {
                  "statement.verb.id": "http://activitystrea.ms/schema/1.0/at"
                }
              ]
            }
          ]
    }
  
  }];