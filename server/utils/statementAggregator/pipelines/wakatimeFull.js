const extensions = '$statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type';

module.exports = filterData =>
    [{
        $match: {
            $and: [{
                $comment: '{\'criterionLabel\':\'A\',\'criteriaPath\':[\'statement\',\'verb\']}',
                'statement.object.definition.extensions.http://lrs&46;learninglocker&46;net/define/extensions/collection-type.date': filterData.date
            }]
        }
    },
    {
        $project: {
            _id: 0,
            fullName: '$statement.actor.name',
            apiKey: '$statement.actor.account.name',
            timestamp: 1,
            date: `${extensions}.date`,
            totalSeconds: `${extensions}.grandTotal.total_seconds`,
            projects: `${extensions}.projects`
        }
    }];
