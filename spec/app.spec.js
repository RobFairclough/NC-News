process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');
// const DBconfig = require('../knexfile').test;

const request = supertest(app);

describe('/api', () => {
  before(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => {
    connection.destroy();
  });
  it('GET request should respond with a JSON object describing all available endpoints on the API', () => {});
  describe.only('/topics', () => {
    it('GET request at /topics should return status 200 and an array of topic objects, each having a slug and description property', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const obj = body.topics[0];
        expect(body.topics.length).to.equal(2);
        expect(obj).to.have.property('slug');
        expect(obj).to.have.property('description');
      }));
    it('POST request at /topics should accept an object with slug and description properties and respond with status 201, returning the posted topic object', () => {
      const testObj = { slug: 'test', description: 'this is a test' };
      return request
        .post('/api/topics')
        .send(testObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.eql([testObj]);
        });
    });
    it('POST request at /topics should only accept the slug if unique and when failing should respond status 422', () => {});
    it('POST request at /topics should not accept the request if missing a slug or description', () => {});
    describe('/:topic/articles', () => {
      it('GET request should respond status 200 and an array of article objects for a given topic', () => {});
      it('GET request each article object should have the properties: author, title, article_id, votes, comment_count, created_at, topic', () => {});
      it('GET request each article object should have a comment count property, which is the accumulated count of all comments associated with this article id', () => {});
      it('GET request should allow for a ?sort_by query and ?order query, allowing users to sort data by any of the columns - defaulting to date and descending respectively', () => {});
      it('GET request should allow for a ?limit query, defaulting to 10', () => {});
      it('GET request should allow pagination with a ?p query, with pages calculated based on the ?limit query', () => {});
      it('GET request should respond status 404 if the topic is not found', () => {});

      it('POST request should return status 201 when successful and respond with the posted article', () => {});
      it('POST request should only accept an article if given properties title, body and username, returning status 400 if unsuccessful', () => {});
    });
  });

  describe('/articles', () => {
    it('GET request should return status 200 and respond with an array of article objects, each object having properties author, title, article_id, body, votes, comment_count, created_at and topic', () => {});
    it('GET request should accept a ?sort_by and ?order query, defaulting to date and descending respectively', () => {});
    it('GET request should accept a limit query, defaulting to 10', () => {});
    it('GET request should accept a ?p query for pagination, with pages calculated based on the ?limit query', () => {});
    describe('/:article_id', () => {
      it('GET request should return status 200 and an article object with properties article_id, author, title, votes, body, comment_count, created_at and topic', () => {});
      it('GET request should return status 404 if no article exists with that id', () => {});

      it('PATCH request should accept an object in the form {inc_votes: newVote}, responding with a status code of 200 and an object of the updated article ', () => {});
      it('PATCH request should respond status code 400 if not given required data', () => {});

      it('DELETE request should delete the article with given id, and respond status 204 and no-content', () => {});
      it('DELETE request should return status 404 if no article exists with given id', () => {});
      describe('/comments', () => {
        it('GET request should respond with status 200 and an array of comments, each having properties comment_id, votes, created_at, author and body', () => {});
        it('GET request should accept a ?sort_by and ?order query, defaulting to date and descending respectively', () => {});
        it('GET request should accept a limit query, defaulting to 10', () => {});
        it('GET request should accept a ?p query for pagination, with pages calculated based on the ?limit query', () => {});

        it('POST request should accept an object with username and body propeties, and respond with the posted comment and status 201 if successful', () => {});
        it('POST request should respond status code 400 if not given required data', () => {});
        describe('/:comment_id', () => {
          it('PATCH request should accept an object in the form {inc_votes: newVote}, responding with a status code of 200 and an object of the updated article ', () => {});
          it('PATCH request should respond status code 400 if not given required data', () => {});

          it('DELETE request should delete given comment by comment_id, and respond with status 204', () => {});
        });
      });
    });
  });

  describe('/users', () => {
    it('GET request should respond status 200 and give an array of user objects with properties username, avatar_url, name', () => {});
    describe('/users/:username', () => {
      it('GET request should respond status 200 and give a user object with properties username, avatar_url, name', () => {});
      it('GET request should respond status 404 if no users exist by that usename', () => {});
    });
  });
});
