exports.handle400 = (err, req, res, next) => {
  const codes400 = ['22P02', '23502', '23503'];
  if (codes400.includes(err.code) || err.status === 400) {
    res.status(400).send({ msg: err.toString() });
  } else next(err);
};
exports.handle422 = (err, req, res, next) => {
  const codes422 = ['23505'];
  if (codes422.includes(err.code) || err.status === 422) res.status(422).send({ msg: err.detail });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  res.status(404).send({ msg: err.message });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: err });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ message: 'invalid method for this endpoint' });
};
