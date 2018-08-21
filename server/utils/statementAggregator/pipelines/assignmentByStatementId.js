module.exports = id =>
  [{
    $match: { 'statement.id': id }
  },
  {
    $project: {
      moodleAssignmentId: '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/project.cmid'
    }
  }];
