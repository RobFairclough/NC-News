# NC Knews

NC Knews is an API built to serve the front-end Northcoders News Sprint. It serves up information on News topics, articles, comments and users.

## Using the API

The NC Knews API is available on Heroku. [This link](https://ncknewsrob.herokuapp.com/api/) provides a JSON object describing all available endpoints. To get access to restricted endpoints you can send a POST request to the /login endpoint, with a valid username and password in this format

```json
{
  "username": "Rob",
  "password": "NC Knews is a nice API"
}
```

This request will return a token you can attach to the authorization header with 'BEARER \<token>' to allow access to restricted endpoints or methods. The response should look like this:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGlja2xlMTIyIiwiaWF0IjoxNTQ3ODA5Mjg2NjM2fQ.GJpdiWyVYdBTQMRg1pMUpgOlh_zlWhYZ051exuG-9X0"
}
```

You can also create an account to gain access to the login endpoint. To do this send a POST request to the /api/users endpoint with the following information:

```json
{
  "username": "YourUserName",
  "password": "YourPassword",
  "avatar_url": "Url for your picture, optional",
  "name": "Your Name"
}
```

If successful, you should receive a status code 201 and an object listing your username, password and name. Your password will be encrypted and stored in the database.

For non-restricted endpoints you don't need to login or set your authorization header. You can just send a request to the APIs listed [here](ncknewsrob.herokuapp.com/api). For example:

```
GET ncknewsrob.herokuapp.com/api/topics/coding/articles
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
To get this project running locally:

### Prerequisites

Running this API locally will require PostgreSQL, Node, NPM and a terminal, to edit it you'll need a text-editor.

- Install [Node.js](https://nodejs.org) by following the instructions on their website. This installation will include NPM. (Min version 8.10.0 Node, 5.6.0 npm, you can check your version by running `node --version` and ```npm --version` in your terminal.)

- Download and install [PostgreSQL](https://www.postgresql.org/download/), alternatively if you have the package manager [Homebrew](https://brew.sh) you can run this command:

```bash
brew install postgresql
```

[Here](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb) is a guide on getting started with postgres. You will only need to get yourself logged in and the psql server running to use this project. Minimum version 10.6 required - you can check your Postgres version by running `psql --version` in your terminal.

### Installation

1. Fork this repo
2. Clone down to your local machine
3. Open the project directory in your terminal and run 'npm install' to install the required dependencies
4. Create a knexfile.js in the project root directory to allow knex to access your database., the contents of this should look like :

```js
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews_dev',
      password: <'postgres password (linux only)'>
    },
      username: <'your postgres username (linux only)'>,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
      username: <'your postgres username (linux only)'>,
      password: <'postgres password (linux only)'>
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './migrations',

      seeds: {
        directory: './seeds',
      },
    },
  },
};
```

5. To create the database, we need to run `psql -f ./db/dev-setup.sql`, this will create an empty database for us to insert our data into.
6. To add data to our new database, we will run `npm run seed` - this will run our migrations to create tables in the database, then insert the data in /db/data/development-data.
7. To start the api's server running locally, you can run npm start to run the server in Node or npm run dev to run the server in Nodemon.
8. The server will then be available to send requests to and retrive data

```
  GET localhost:9000/api/topics
```

## Running the tests

To run the tests, run npm test in your terminal - this will drop and re-create the database, run all migrations and re-seed the test database before runnin automated tests for all endpoints and methods/

### The tests

```javascript
describe('/articles', () => {
    it('GET request should return status 200 and respond with an array of article objects, each object having properties author, title, article_id, body, votes, comment_count, created_at and topic', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
```

The tests will make requests to each endpoint, with valid and invalid requests to make sure the api runs, sends the correct data or sends the correct error message for an invalid request.

```javascript
.expect(200)
```

For a successful request, we're expecting the status code 200 - success

```javascript
.then(({ body }) => {
  expect(body.article.article_id).to.equal(1);
})
```

Afterwards, we destructure the body of the request's response and check that it has the right properties

```javascript
it('POST request should respond status code 404 if posted to an article ID that doesnt exist', () =>
  request
    .post('/api/articles/6969/comments')
    .send({ username: 'icellusedkars', body: 'real comment' })
    .expect(404));
```

for this invalid request, we just test for the correct status code - 404 not found.

```javascript
it('POST request should create a user that is able to log in', () =>
  request
    .post('/api/users')
    .send({
      username: 'log',
      name: 'log',
      password: 'cabin'
    })
    .expect(201)
    .then(() =>
      request
        .post('/login')
        .send({ username: 'log', password: 'cabin' })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.property('token');
        })
    ));
```

This test makes multiple requests, expecting different status codes and results. To do this we chain the follow-up request in the .then() of the first request and return a second request. This is important to ensure the first request is functioning correctly, as the result is not directly testable from the first request's response.

## Deployment

The API is already deployed live on [Heroku](https://ncknewsrob.herokuapp.com/api/), but if you would like to host your own version you can follow these steps:

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run `Heroku login` in your terminal to open a browser window to login to your heroku account
3. Run this command:

```bash
Heroku create <your project name>
```

4. You can then run this command to provision a PostgreSQL database for your API:

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. To make sure this has worked, run the command:

```bash
heroku config:get: DATABASE_URL
```

If the database has been created, this should return a long URL beginning postgres://.

6. To set the secret key for encrypting user passwords, run this command (the database will not seed correctly without this):

```bash
heroku config:set JWT_SECRET=<your secret recommended 64+ chars>
```

7. To deploy your api, `git commit` your changes and run `git push heroku master`. This will upload your app to Heroku's servers and build it. You can then run `heroku open` to see your app live.

8. Now that your API is online, it's time to seed. We've provided a command for this so in your terminal just run `npm run seed:prod`, this will run the database migrations and seed some sample development data in. If you'd prefer an empty database to fill yourself, just run `npm run migrate:latest:prod` to set up the database with empty table schemas.

9. The API is now ready to use!

## Built With

- [Knex](https://knexjs.org/) - SQL query builder used for database migration, seeding and querying.
- [JWT](https://jwt.io/) - JavaScript Web Tokens for tokening logins
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Encryption for user passwords
- [Supertest](https://github.com/visionmedia/supertest) - Used to run tests on http requests on each of the endpoints

## Contributing

Feel free to submit detailed pull requests if you have anything you'd like to add.

## Authors

- **Rob Fairclough** - _Initial work_ - [Github](https://github.com/RobFairclough)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Northcoders
