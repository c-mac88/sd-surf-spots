const _ = require('lodash');
const moment = require('moment');
const Moodle = require('../../server/utils/moodle');

module.exports = (Proxy) => {
  Proxy.getRandomGifByTagFW = (tag, cb) => {
    getRandomGifByTag(tag)
    .then((response) => {
      cb(null, response.images.fixed_width.url);
    });
  };

  Proxy.remoteMethod('getRandomGifByTagFW', {
    description: 'Gets the url of a random gif from giphy based on a keyword',
    accepts: { arg: 'tag', type: 'string' },
    http: { path: '/getRandomGifByTagFW/:tag', verb: 'get' },
    returns: { arg: 'url', type: 'string' }
  });
};
