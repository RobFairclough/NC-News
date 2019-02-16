import { Request, Response, NextFunction } from 'express';

const serveJSON = (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(`${process.cwd()}/data/endpoints.JSON`);
};

module.exports = { serveJSON };
