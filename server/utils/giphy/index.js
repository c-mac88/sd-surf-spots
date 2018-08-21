const giphy = require('giphy-api')({
  apiKey: '46XieQ0OvXfORngoZrjrZbVbvUB33q2K',
  https: false
});

const getRandomGifByTag = tag =>
  giphy.translate({
    s: tag,
    rating: 'g'
  }).then(res => res.data);

module.exports = { getRandomGifByTag };
