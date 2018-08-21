module.exports = () => [
  {
    $match: {
      "$and": [
        {
          "$comment": "{\"criterionLabel\":\"A\",\"criteriaPath\":[\"statement\",\"verb\"]}",
          "$or": [
            {
              "statement.verb.id": "https://brindlewaye.com/xAPITerms/verbs/loggedin/"
            }
          ]
        },
        {
          "$comment": "{\"criterionLabel\":\"B\",\"criteriaPath\":[\"timestamp\"]}",
          "timestamp": {
            "$gt": {
              "$dte": "2017-9-30T00:00Z"
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
      moodleUserId: '$statement.actor.account.name',
      timestamp: 1
    }
  }
];
