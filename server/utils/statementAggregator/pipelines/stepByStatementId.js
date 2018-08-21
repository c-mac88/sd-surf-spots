module.exports = id =>
  [{
    $match: { 'statement.id': id }
  },
  {
    $project: {
      challengeId: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/id',
      assignmentId: '$statement.object.definition.extensions.http://id&46;tincanapi&46;com/extension/topic'
    }
  }];
