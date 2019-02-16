import { Request, Response, NextFunction } from 'express';

exports.handle400 = (err: any, req: Request, res: Response, next: NextFunction) => {
  const codes400: string[] = ['22P02', '23502', '23503'];
  if (codes400.includes(err.code) || err.status === 400) {
    if (err.constraint && !err.constraint.includes('username')) return next(err);
    return res.status(400).send({ msg: err.toString() });
  }
  return next(err);
};
exports.handle401 = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 401) return res.status(401).send(err);
  return next(err);
};
exports.handle422 = (err: any, req: Request, res: Response, next: NextFunction) => {
  const codes422: string[] = ['23505'];
  if (codes422.includes(err.code) || err.status === 422) {
    return res.status(422).send({ msg: err.detail });
  }
  return next(err);
};

exports.handle404 = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ msg: err.message });
};

exports.handle500 = (err: any, req: Request, res: Response, next: NextFunction) => res.status(500).send({ msg: err });

exports.handle405 = (req: Request, res: Response, next: NextFunction) => res.status(405).send({ message: 'invalid method for this endpoint' });
