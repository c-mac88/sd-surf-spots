const courseOrder = [29, 2, 3, 35, 36, 10, 5, 11, 9, 7, 8, 14, 12];

const courses = [
  {
    moodleCourseId: 29,
    shortname: 'NODE100',
    fullname: 'Introduction to Programming with NodeJS (NODE100)',
    assignmentOrder: [358, 359, 360, 361, 362, 363]
  },
  {
    moodleCourseId: 2,
    shortname: 'WEB100',
    fullname: 'HTML/CSS Basics (WEB100)',
    assignmentOrder: [364, 365, 366, 367, 368, 369]
  },
  {
    moodleCourseId: 3,
    shortname: 'WEB101',
    fullname: 'JavaScript in the DOM (WEB101)',
    assignmentOrder: [370, 371, 372, 373, 374]
  },
  {
    moodleCourseId: 35,
    shortname: 'ALG100',
    fullname: 'Data Structures/Algorithms (ALG100)',
    assignmentOrder: []
  },
  {
    moodleCourseId: 36,
    shortname: 'WEB102',
    fullname: 'JavaScript Projects Intro (WEB102)',
    assignmentOrder: [413, 414, 415]
  },
  {
    moodleCourseId: 10,
    shortname: 'NODE101',
    fullname: 'Intro to Express (NODE101)',
    assignmentOrder: [218, 219, 220, 221, 222]
  },
  {
    moodleCourseId: 5,
    shortname: 'OPS100',
    fullname: 'Git ChromeDevtools (OPS100)',
    assignmentOrder: [245, 244]
  },
  {
    moodleCourseId: 11,
    shortname: 'REACT100',
    fullname: 'Intro to React (REACT100)',
    assignmentOrder: [254, 265, 258, 257, 259]
  },
  {
    moodleCourseId: 9,
    shortname: 'OPS200',
    fullname: 'Building and Deploying Apps (OPS200)',
    assignmentOrder: [267, 268, 269, 270]
  },
  {
    moodleCourseId: 7,
    shortname: 'DB100',
    fullname: 'Relational Databases (DB100)',
    assignmentOrder: [277]
  },
  {
    moodleCourseId: 8,
    shortname: 'DB200',
    fullname: 'NO-SQL Databases (DB200)',
    assignmentOrder: [292, 293, 294]
  },
  {
    moodleCourseId: 14,
    shortname: 'NODE200',
    fullname: 'Intermediate Express (NODE200)',
    assignmentOrder: [303, 304, 305]
  },
  {
    moodleCourseId: 12,
    shortname: 'REACT200',
    fullname: 'Intermediate React (NODE200)',
    assignmentOrder: [308, 316, 317]
  }
];

const projects = [
  // WEB 102
  {
    title: 'Astro Weight Calculator',
    projectName: 'startnow-web101-astro-weight-calculator',
    markdown: '',
    moodleAssignmentId: 413,
    moodleCourseId: 36
  },
  {
    title: 'Change Calculator',
    projectName: 'startnow-web101-change-calculator',
    markdown: '',
    moodleAssignmentId: 414,
    moodleCourseId: 36
  },
  {
    title: 'San Diego Top Spots',
    projectName: 'startnow-web101-san-diego-top-spots',
    markdown: '',
    moodleAssignmentId: 415,
    moodleCourseId: 36
  },

  // NODE 101
  {
    title: 'Hello HTTP Server',
    projectName: 'startnow-node101-hello-http-server',
    markdown: '',
    moodleAssignmentId: 218,
    moodleCourseId: 10
  },
  {
    title: 'Express Server',
    projectName: 'startnow-node101-express-server',
    markdown: '',
    moodleAssignmentId: 219,
    moodleCourseId: 10
  },
  {
    title: 'Movie Finder Data',
    projectName: 'startnow-node101-movie-finder-data',
    markdown: '',
    moodleAssignmentId: 220,
    moodleCourseId: 10
  },
  {
    title: 'Log all the things',
    projectName: 'startnow-node101-log-all-the-things',
    markdown: '',
    moodleAssignmentId: 221,
    moodleCourseId: 10
  },
  {
    title: 'VSTDA API',
    projectName: 'startnow-node101-vstda-api',
    markdown: '',
    moodleAssignmentId: 222,
    moodleCourseId: 10
  },

  // OPS100
  {
    title: 'Git Upload',
    projectName: 'startnow-ops100-git-upload',
    markdown: '',
    moodleAssignmentId: 245,
    moodleCourseId: 5
  },
  {
    title: 'Gulp and Npm',
    projectName: 'startnow-ops100-gulp-and-npm',
    markdown: '',
    moodleAssignmentId: 244,
    moodleCourseId: 5
  },

  // REACT100
  {
    title: 'Workshop',
    projectName: 'startnow-react100-workshop',
    markdown: '',
    moodleAssignmentId: 254,
    moodleCourseId: 11
  },
  {
    title: 'Mortgage Calculator',
    projectName: 'startnow-react100-mortgage-calculator',
    markdown: '',
    moodleAssignmentId: 265,
    moodleCourseId: 11
  },
  {
    title: 'Change Calculator',
    projectName: 'startnow-react100-change-calculator',
    markdown: '',
    moodleAssignmentId: 258,
    moodleCourseId: 11
  },
  {
    title: 'San Diego Top Spots',
    projectName: 'startnow-react100-san-diego-top-spots',
    markdown: '',
    moodleAssignmentId: 257,
    moodleCourseId: 11
  },
  {
    title: 'VSTDA',
    projectName: 'startnow-react100-vstda',
    markdown: '',
    moodleAssignmentId: 259,
    moodleCourseId: 11
  },

  // OPS200
  {
    title: 'Webpack It Up',
    projectName: 'startnow-ops200-webpack-it-up',
    markdown: '',
    moodleAssignmentId: 267,
    moodleCourseId: 9
  },
  {
    title: 'Prove It Works',
    projectName: 'startnow-ops200-prove-it-works',
    markdown: '',
    moodleAssignmentId: 268,
    moodleCourseId: 9
  },
  {
    title: 'Deploy All The Things',
    projectName: 'startnow-ops200-deploy-all-the-things',
    markdown: '',
    moodleAssignmentId: 269,
    moodleCourseId: 9
  },
  {
    title: 'Deliver It Well',
    projectName: 'startnow-ops200-deliver-it-well',
    markdown: '',
    moodleAssignmentId: 270,
    moodleCourseId: 9
  },

  // DB100
  {
    title: 'MySQL Exercises',
    projectName: 'startnow-db100-mysql-exercises',
    markdown: '',
    moodleAssignmentId: 277,
    moodleCourseId: 7
  },

  // DB200
  {
    title: 'MongoDB Workshop',
    projectName: 'startnow-db200-mongodb-workshop',
    markdown: '',
    moodleAssignmentId: 292,
    moodleCourseId: 8
  },
  {
    title: 'MongoDB Exercises',
    projectName: 'startnow-db200-mongodb-exercises',
    markdown: '',
    moodleAssignmentId: 293,
    moodleCourseId: 8
  },
  {
    title: 'Redis Workshop',
    projectName: 'startnow-db200-redis-workshop',
    markdown: '',
    moodleAssignmentId: 294,
    moodleCourseId: 8
  },

  // NODE200 [ejs = 299, 303, 304, 305]
  {
    title: 'Mongoose Blog Api',
    projectName: 'startnow-node200-mongoose-blog-api',
    markdown: '',
    moodleAssignmentId: 303,
    moodleCourseId: 14
  },
  {
    title: 'Sequelize Workshop',
    projectName: 'startnow-node200-sequelize-workshop',
    markdown: '',
    moodleAssignmentId: 304,
    moodleCourseId: 14
  },
  {
    title: 'Loopback Workshop',
    projectName: 'startnow-node200-loopback-workshop',
    markdown: '',
    moodleAssignmentId: 305,
    moodleCourseId: 14
  },

  // REACT200
  {
    title: 'Budget Tracker',
    projectName: 'startnow-react200-budget-tracker',
    markdown: '',
    moodleAssignmentId: 308,
    moodleCourseId: 12
  },
  {
    title: 'Weather App',
    projectName: 'startnow-react200-weather-app',
    markdown: '',
    moodleAssignmentId: 316,
    moodleCourseId: 12
  },
  {
    title: 'Movie Finder',
    projectName: 'startnow-react200-movie-finder',
    markdown: '',
    moodleAssignmentId: 317,
    moodleCourseId: 12
  }
];

module.exports = {
  courseOrder,
  projects,
  courses
};
