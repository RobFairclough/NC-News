"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require('express')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser').json();
const cors = require('cors');
const apiRouter = require('./routes/api');
const secureRouter = require('./routes/secure');
const { handle404, handle400, handle422, handle401, handle500, } = require('./errors');
const connection = require('./db/connection');
const JWT_SECRET = require('./passconfig');
const { authorise } = require('./controllers/secure');
app.use(cors());
app.use(bodyParser);
app.use('/api', apiRouter);
app.get('/', (req, res) => res.send('homepage'));
// auth bonus
app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
        return next({ status: 401, msg: 'invalid login' });
    return connection('users')
        .where('username', username)
        .then(([user]) => {
        if (user) {
            return Promise.all([bcrypt.compare(password, user.password), user]).then(([passwordOk, authorisedUser]) => {
                if (authorisedUser && passwordOk) {
                    const token = jwt.sign({ user: authorisedUser.username, iat: Date.now() }, JWT_SECRET);
                    return res.status(200).send({ token });
                }
                return next({ status: 401, msg: 'invalid login' });
            });
        }
        return next({ status: 401, msg: 'invalid login' });
    })
        .catch(next);
});
app.use('/secure', authorise);
app.use('/secure', secureRouter);
// error handling
app.use(handle400);
app.use(handle401);
app.use(handle422);
app.use(handle404);
app.use(handle500);
// module.exports = app;
exports.default = app;
