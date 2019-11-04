import { ErrorRequestHandler, Handler } from 'express';


const handle400: ErrorRequestHandler  = (err, req, res, next) => {
  const codes400: string[] = ['22P02', '23502', '23503'];
  if (codes400.includes(err.code) || err.status === 400) {
    if (err.constraint && !err.constraint.includes('username')) return next(err);
    return res.status(400).send({ msg: err.toString() });
  }
  return next(err);
};


const handle401: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 401) return res.status(401).send(err);
  return next(err);
};
const handle422: ErrorRequestHandler = (err, req, res, next) => {
  const codes422 = ['23505'];
  if (codes422.includes(err.code) || err.status === 422) {
    return res.status(422).send({ msg: err.detail });
  }
  return next(err);
};

const handle404: ErrorRequestHandler = (err, req, res) => {
  res.status(404).send({ msg: err.message });
};

const handle405: Handler = (req, res) => res.status(405).send({ message: 'invalid method for this endpoint' });

const handle500: ErrorRequestHandler = (err, req, res) => res.status(500).send({ msg: err });


module.exports = {
  handle400, handle401, handle404, handle405, handle422, handle500
}