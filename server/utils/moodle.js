const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');

const BASE_URL = 'http://lms.origincodeacademy.com/webservice/rest/server.php';

const excludedUserIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 17, 19, 20, 21, 31, 70, 76, 77, 119, 122
];

module.exports = class Moodle {
  constructor(accessToken) {
    this.token = accessToken;

    this.verifyUser = this.verifyUser.bind(this);
  }

  buildRequestUrl(action, params = {}) {
    let mappedParams = Object
      .keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');

    mappedParams = mappedParams.length ? `&${mappedParams}` : '';

    return `${BASE_URL}?wstoken=${this.token}&wsfunction=${action}&moodlewsrestformat=json${mappedParams}`;
  }

  makeRequest(verb = 'get', action, criterion) {
    const url = this.buildRequestUrl(action, criterion);
    return axios[verb.trim().toLowerCase()](url).then(response => response.data);
  }

  getUngradedSubmissions() {
    let users = null;
    let assignmentsGroupedByCourse = null;
    let submissionsGroupedByAssignment = null;

    const getAssignmentsForCourses = courseIds => this.getAssignmentsForCourses(courseIds);
    const getSubmissionsForAssignments = assignmentIds => this.getSubmissionsForAssignments(assignmentIds);
    const bindRelatedKeysToSubmission = assignment => (submission) => {
      const course = assignmentsGroupedByCourse
        .find(c => c.assignments.map(a => a.id).includes(assignment.assignmentid));

      const courseAssignment = course.assignments.find(a => a.id === assignment.assignmentid);

      return _.extend(submission, {
        assignmentId: assignment.assignmentid,
        courseId: course.id,
        courseName: course.shortname,
        cmid: courseAssignment.cmid
      });
    };
    const bindSubmissionsToAssignment = assignment => (_.extend(assignment, {
      submissions: assignment.submissions.map(bindRelatedKeysToSubmission(assignment))
    }));
    const excludeSubmissionsForNonGradableAssignments = submissions =>
      submissions.filter((submission) => {
        const courseForSubmission = assignmentsGroupedByCourse.find(course =>
          course.assignments.some(a => a.id === submission.assignmentId)
        );
        const assignmentForSubmission = courseForSubmission.assignments.find(assignment =>
          assignment.id === submission.assignmentId
        );

        return assignmentForSubmission.completionsubmit === 0;
      });
    const transformSubmissionsForView = submissions => submissions.map((submission) => {
      const submissionUser = users.find(user =>
        user.id === submission.userid
      );
      const submissionCourse = assignmentsGroupedByCourse.find(course =>
        course.id === submission.courseId
      );
      const submissionAssignment = submissionCourse.assignments.find(assignment =>
        assignment.id === submission.assignmentId
      );

      const hoursSinceSubmission = moment().diff(moment.unix(submission.timecreated), 'hours');

      const bsColor = hoursSinceSubmission < 24 ? 'success' : 'danger';

      return {
        courseId: submission.courseId,
        cmid: submission.cmid,
        submissionStatus: submission.status,
        assignmentId: submission.assignmentId,
        submissionId: submission.id,
        studentId: submission.userid,
        name: `${submission.courseName} - ${submissionAssignment.name}`,
        student: submissionUser && submissionUser.fullname,
        avatar: submissionUser && submissionUser.profileimageurl,
        text: submission.plugins.find(p => p.type === 'comments').name,
        moodleStatus: submission.gradingstatus,
        submissionDate: {
          value: submission.timecreated,
          formatted: moment.unix(submission.timecreated).fromNow()
        },
        bsColor
      };
    });
    const excludeGradedSubmissions = mappedSubmissions => mappedSubmissions.filter(submission =>
      submission.submissionStatus === 'submitted' && submission.moodleStatus === 'notgraded' && submission.student && !excludedUserIds.includes(submission.studentId)
    );
    const sortSubmissionsForView = submissions => submissions.sort((a, b) => {
      if (a.submissionDate.value > b.submissionDate.value) {
        return -1;
      } else if (a.submissionDate.value < b.submissionDate.value) {
        return 1;
      }

      return 0;
    });

    return this
      .getAllUsers()
      .then((data) => { users = data.users; })
      .then(() => this.getAllCourses())
      .then(courses => courses.map(c => c.id))
      .then(getAssignmentsForCourses)
      .then((data) => {
        assignmentsGroupedByCourse = data.courses;

        return assignmentsGroupedByCourse;
      })
      .then(courses => _.flatten(courses.map(course => course.assignments)))
      .then(assignments => assignments.map(a => a.id))
      .then(getSubmissionsForAssignments)
      .then((data) => {
        submissionsGroupedByAssignment = data.assignments.map(bindSubmissionsToAssignment);

        return submissionsGroupedByAssignment;
      })
      .then(assignments => _.flatten(assignments.map(assignment => assignment.submissions)))
      .then(excludeSubmissionsForNonGradableAssignments)
      .then(transformSubmissionsForView)
      .then(excludeGradedSubmissions)
      .then(sortSubmissionsForView)
      .catch(console.error);
  }

  /**
   * If an email matches a valid student returns some student info
   * @param {string} email
   * @returns {Promise<Array>}
   */
  getStudentsForEmail(email) {
    return this.makeRequest('get', 'core_user_get_users', {
      'criteria[0][key]': 'email',
      'criteria[0][value]': email
    });
  }

    /**
   * If an id matches a valid student returns some student info
   * @param {string} id
   * @returns {Promise<Array>}
   */
  getStudentsForId(id) {
    return this.makeRequest('get', 'core_user_get_users', {
      'criteria[0][key]': 'id',
      'criteria[0][value]': id
    });
  }

  /**
   * Gets all users inside Moodle
   *
   * @returns {Promise<Array>}
   */
  getAllUsers() {
    return this.makeRequest('get', 'core_user_get_users', {
      'criteria[0][key]': 'email',
      'criteria[0][value]': '%'
    });
  }

  /**
   * Gets all courses accessible for given token
   * @param {string} email - User's public github email
   * @returns {Promise<string>}
   */
  getAllCourses() {
    return this.makeRequest('get', 'core_course_get_courses');
  }

  /**
   * Gets all assignments for a single course
   *
   * @param {number} courseId - Id of the course on Moodle
   * @returns {Promise<object>}
   */
  getAssignmentsForCourse(courseId) {
    return this.getAssignmentsForCourses([courseId]);
  }

  /**
   * Gets all assignments for multiple courses
   *
   * @param {number} courseId - Id of the course on Moodle
   * @returns {Promise<object>}
   */
  getAssignmentsForCourses(courseIds) {
    const params = {};

    courseIds.forEach((id, i) => {
      params[`courseids[${i}]`] = id;
    });

    return this
      .makeRequest('get', 'mod_assign_get_assignments', params);
  }

  /**
   * Gets all submissions for a single assignment
   *
   * @param {any} assignmentId
   * @returns
   */
  getSubmissionsForAssignment(assignmentId) {
    return this.getSubmissionsForAssignments([...assignmentId]);
  }

  /**
   * Gets all submissions for many assignments
   *
   * @param {any} assignmentIds
   * @returns
   */
  getSubmissionsForAssignments(assignmentIds) {
    const params = {};

    assignmentIds.forEach((id, i) => {
      params[`assignmentids[${i}]`] = id;
    });

    return this.makeRequest('get', 'mod_assign_get_submissions', params);
  }

  /**
   * Gets grades for a course
   *
   * @param {any} courseId
   * @returns {Promise<object>}
   */
  getGradesForCourse(courseId, userId = 0, groupId = 0) {
    return this.makeRequest('get', 'gradereport_user_get_grade_items', {
      courseid: courseId,
      userid: userId,
      groupid: groupId
    });
  }

  /**
   * Update activity completion status for currently authenticated user.
   * Note - this operation only applies to the currently authenticated user.
   *
   * @param {any} activityId - id of activity
   * @param {any} isComplete - true => complete, false => incomplete
   * @returns {Promise}
   */
  updateActivityCompletionStatus(activityId, isComplete) {
    return this.makeRequest('get', 'core_completion_update_activity_completion_status_manually', {
      cmid: activityId,
      completed: isComplete
    });
  }

  /**
   * Save a grade for an assignment
   *
   * @param {number} assignmentId - The assignment id to operate on
   * @param {number} userId - The student id to operate on
   * @param {Object} grade - Object containing grade information
   * @param {number} grade.grade - The new grade for this user.
   * @param {number} grade.attemptNumber - The attempt number
   * @param {boolean} grade.addAttempt - Allow another attempt
   * @param {string} grade.workflowState - The next marking workflow state
   * @param {boolean} grade.applyToAll - If true, all group members will be graded
   * @param {Array} grade.pluginData - plugin data
   * @param {Array} grade.advancedGradingData - advanced grading data
   * @returns {Promise}
   */
  saveGradeForAssignment(assignmentId, userId, grade) {
    return this.makeRequest('get', 'mod_assign_save_grade', {
      assignmentid: assignmentId,
      userid: userId,
      grade: grade.grade,
      attemptnumber: grade.attemptNumber || -1,
      addattempt: Number(grade.addAttempt || 0),
      workflowstate: grade.workflowstate || '',
      applytoall: Number(grade.applyToAll || 0)
    });
  }

  /**
   * Update a grade item and associated student grades.
   *
   * @param {string} source - The source of the grade update
   * @param {number} courseid - id of course
   * @param {string} component - A component, for example mod_forum or mod_quiz
   * @param {number} activityid - The activity ID
   * @param {number} itemnumber - grade item ID number for modules that have multiple grades.
   * @param {Array} grades - Any student grades to alter
   * @returns
   */
  updateGradeItem(source, courseid, component, activityid, itemnumber, grades) {
    const params = {
      source,
      courseid,
      component,
      activityid,
      itemnumber
    };

    if (grades.length) {
      grades.forEach((grade, i) => {
        Object.keys(grade).forEach((key) => {
          params[`grades[${i}][${key}]`] = grade[key];
        });
      });
    }

    return this.makeRequest('get', 'core_grades_update_grades', params);
  }

  /**
   * Grades all LTI assignments as 100 in a single course.
   *
   * @param {any} courseId - id of a course
   * @param {any} studentId - id of a student
   * @param {any} assignments - array of LTI assignments
   */
  markAllReplitsDone(courseId, studentId, assignments) {
    return assignments.forEach((item) => {
      this.updateGradeItem('', courseId, 'mod_lti', item, 0, [{
        studentid: studentId,
        grade: 100,
        str_feedback: 'Repl.it assignment completed'
      }]);
    });
  }

  /**
   * Enroll a single student in a course.
   *
   * @param {int} courseId - id of a course
   * @param {int} studentId - id of a student
   */
  enrollStudent(courseId, studentId) {
    return this.makeRequest('get', 'enrol_manual_enrol_users', {
      'enrolments[0][roleid]': 5,
      'enrolments[0][userid]': studentId,
      'enrolments[0][courseid]': courseId
    });
  }

  /**
   * If an email matches a valid student returns some student info
   *
   * @param {string} email - User's public github email
   * @returns {Promise<string>}
   */
  verifyUser(email) {
    return this
      .getStudentsForEmail(email)
      .then(({ users }) => {
        if (users.length > 0) {
          const user = users[0];
          if (user.email === email && !user.suspended) {
            return Promise.resolve({ email, id: user.id, fullName: user.fullname });
          }
        }
        return Promise.reject('User not valid');
      });
  }
};
