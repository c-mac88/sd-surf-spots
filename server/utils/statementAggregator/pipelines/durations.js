module.exports = () => [
  {
    $match: {
      $and: [
        {
          $or: [
            {
              'statement.verb.id': 'http://www.tincanapi.co.uk/verbs/enrolled_onto_learning_plan'
            }
          ],
          $comment: '{"criterionLabel":"A","criteriaPath":["statement","verb"]}'
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      course: '$statement.object.definition.name.en',
      name: '$statement.actor.name',
      moodleUserId: '$statement.actor.account.name',
      timestamp: 1
    }
  }
];
