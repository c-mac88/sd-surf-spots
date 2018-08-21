const extensions = '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type';

module.exports = () =>
  [{
    $match: {
      $and: [
        {
          $comment: '{"criterionLabel":"C","criteriaPath":["statement","object"]}',
          $or: [{ 'statement.object.id': 'https://wakatime.com' }]
        }
      ]
    }
  },
  {
    $project: {
      _id: 0,
      fullName: '$statement.actor.name',
      timestamp: 1,
      grandTotal: `${extensions}.grandTotal.total_seconds`,
      projects: `${extensions}.projects`
    }
  }];
