import { Handler } from 'express';

const serveJSON: Handler = (req, res) => {
  res.sendFile(`${process.cwd()}/data/endpoints.JSON`);
};

module.exports = { serveJSON };
