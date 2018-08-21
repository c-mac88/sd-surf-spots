const GitHubApi = require('github');
const bluebird = require('bluebird');

const github = new GitHubApi({
  debug: false,
  protocol: 'https',
  host: 'api.github.com',
  headers: {
    'user-agent': 'oca-lesson-service' // GitHub is happy with a unique user agent
  },
  Promise: bluebird,
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

github.authenticate({
  type: 'token',
  token: process.env.GIT_TOKEN
});

const getMarkdown = function getMarkdown(options) {
  return github.repos.getContent(options).then((res) => {
    const b64string = res.data.content;
    const content = Buffer.from(b64string, 'base64').toString('utf-8');
    return content;
  });
};

module.exports = {
  getMarkdown
};
