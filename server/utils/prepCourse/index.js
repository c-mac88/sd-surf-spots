const app = require('../../server');
const { getXapiState } = require('../xAPIStateHandler');
const moment = require('moment-timezone');

const getPrepCourseStats = () =>
  new Promise((resolve, reject) => {
    app.models.Course.find()
    .then((courses) => {
      app.models.user.find({ where: { studentType: 'PREP', moodleUserId: { neq: null }, disabled: false } })
      .then((students) => {
        const results = students.map(student =>
        getXapiState(student.moodleUserId, 'COURSE')
        .then((response) => {
          const course = courses.find(x => x.id == response.data.courseId);
          let total = 0;
          if (course.title === 'NODE100') {
            total += 22;
          } else if (course.title === 'WEB101') {
            total += 42;
          }
          total += response.data.index < 0 ? 13 : response.data.index;
          return {
            name: student.fullName || 'no name',
            email: student.email,
            enrolled: moment(student.id.getTimestamp()).format('lll'),
            total,
            course: course.title,
            lesson: response.data.index < 0 ? 'finished' : response.data.index
          };
        })
        .catch(err => reject(err)));
        return Promise.all(results)
        .then(result => resolve(result.sort((a, b) => b.total - a.total)));
      })
    .catch(err => reject(err));
    });
  });

module.exports = {
  getPrepCourseStats
};
