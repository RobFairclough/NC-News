const serveJSON = (req, res, next) => {
  res.sendFile('../data/endpoints.JSON');
};

module.exports = { serveJSON };
