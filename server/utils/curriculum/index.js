const markdown = require('./markdown');

module.exports = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  const options = {
    repo: 'Curriculum',
    owner: 'OriginCodeAcademy',
    path: `/${req.query.path}`
  };
  return markdown.getMarkdown(options)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ error: err }));
};
