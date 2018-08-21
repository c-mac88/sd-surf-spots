module.exports = projectData =>
({
  actor: {
    name: projectData.fullName,
    account: {
      homePage: 'http://lms.origincodeacademy.com',
      name: projectData.moodleUserId
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/completed',
    display: {
      en: 'completed'
    }
  },
  object: {
    objectType: 'Activity',
    id: `https://github.com/OriginCodeAcademy/Curriculum/blob/master/startnow/PROJECTS/${projectData.assignmentId}.md`,
    definition: {
      type: 'http://lrs.learninglocker.net/define/type/project',
      name: {
        en: projectData.moodleAssignmentName
      },
      description: {
        en: 'A code challenge project'
      },
      extensions: {
        'http://lrs.learninglocker.net/define/extensions/project': {
          course_id: projectData.courseId,
          cmid: projectData.cmid,
          project: projectData.assignmentId
        }
      }
    }
  },
  result: {
    score: {
      raw: 100
    },
    completion: true
  },
  authority: {
    objectType: 'Agent',
    name: 'Jeeves',
    mbox: 'mailto:jeeves@origincodeacademy.com'
  },
  timestamp: new Date()
});
