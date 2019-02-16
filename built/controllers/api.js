const serveJSON = (req, res, next) => {
  res.sendFile(`${process.cwd()}/data/endpoints.JSON`);
};
module.exports = { serveJSON };
