exports.handle400 = (err, req, res, next) => {
  const codes400 = ['22PO2', '23502'];
  if (codes400.includes(err.code)) res.status(400).send({ msg: err.toString() });
  else next(err);
};
exports.handle422 = (err, req, res, next) => {
  const codes422 = ['23505'];
  if (codes422.includes(err.code)) res.status(422).send({ msg: err.detail });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  console.log(err);
  res.status(404).send({ msg: err.message });
};
