process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => {
    connection.destroy();
  });
  it('GET request should respond with a JSON object describing all available endpoints on the API', () => {});
  describe('/topics', () => {
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
          expect(body.topic).to.eql(testObj);
        });
    });
    it('POST request at /topics should only accept the slug if unique and when failing should respond status 422', () => {
      const testObj = { slug: 'mitch', description: 'duplicate slug' };
      return request
        .post('/api/topics')
        .send(testObj)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('Key (slug)=(mitch) already exists.');
        });
    });
    it('POST request at /topics should not accept the request if missing a description', () => {
      const testObj = { slug: 'test' };
      return request
        .post('/api/topics')
        .send(testObj)
        .expect(400);
    });
    it('POST request at /topics should not accept the request if missing a slug', () => {
      const testObj = { description: 'test' };
      return request
        .post('/api/topics')
        .send(testObj)
        .expect(400);
    });
    describe('/:topic/articles', () => {
      it('GET request should respond status 200 and an array of article objects for a given topic, containing all required properties including an accurate comment count', () => request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0]).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'votes',
            'created_at',
            'comment_count',
            'topic',
          );
          expect(body.articles[0].comment_count).to.equal('2');
        }));
      it('GET request should allow for a ?sort_by query and ?order query, allowing users to sort data by any of the columns - defaulting to date and descending respectively', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].created_at).to.equal('2018-11-15');
          expect(body.articles[2].created_at).to.equal('2010-11-17');
        }));
      it('GET request should allow for a ?limit query', () => request
        .get('/api/topics/mitch/articles?limit=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        }));
      it('GET request should allow pagination with a ?p query, with pages calculated based on the ?limit query', () => request
        .get('/api/topics/mitch/articles?limit=1&p=3&sort_by=article_id&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0].title).to.equal('Eight pug gifs that remind me of mitch');
          expect(body.articles[0].article_id).to.equal(3);
        }));
      it('GET request should respond status 404 if the topic has no articles about it', () => request.get('/api/topics/invalidity/articles').expect(404));
      it('GET request should ignore invalid queries', () => request
        .get(
          '/api/topics/cats/articles?limit=theyredogs&sortby=dogbreed&p=pagefour&order=forwards',
        )
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0]).to.have.property('author');
          expect(body.articles[0].title).to.equal(
            'UNCOVERED: catspiracy to bring down democracy',
          );
          expect(body.articles[0].comment_count).to.equal('2');
        }));

      it('POST request should return status 201 when successful and respond with the posted article', () => {
        const testObj = {
          title: 'cats: can they read?',
          body: 'probably not, right? but how would we know?',
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(testObj)
          .expect(201)
          .then(({ body }) => {
            expect(body.article.title).to.equal(testObj.title);
            expect(body.article.body).to.equal(testObj.body);
            expect(body.article.username).to.equal(testObj.username);
            expect(body.article.topic).to.equal('cats');
            expect(body.article.votes).to.equal(0);
            expect(body.article.article_id).to.equal(13);
            expect(body.article).to.have.property('created_at');
          });
      });
      it('POST request should only accept an article if given properties title, body and username, returning status 400 if unsuccessful', () => request
        .post('/api/topics/cats/articles')
        .send({ title: 'cats: have they stolen my body?', username: 'rogersop' })
        .expect(400));
      it('POST request should return status 404 if the topic is not in the db', () => request
        .post('/api/topics/dogs/articles')
        .send({
          title: 'The 25 dog-based languages you NEED to learn',
          username: 'rogersop',
          body: 'C(anine), Pupthon, Pupy, ChiuauaScript, Doge.js, Dolang, matLabrador',
        })
        .expect(404));
      it('POST request should return 404 if the username is not in the db', () => request
        .post('/api/topics/cats/articles')
        .send({
          title:
              'Why its not a bad thing that cats leave dead birds and rodents in your house, and fun DIY recipes to make use of them!',
          username: 'notACat',
          body: 'cook the birb pls',
        })
        .expect(404));
    });
  });

  describe('/articles', () => {
    it('GET request should return status 200 and respond with an array of article objects, each object having properties author, title, article_id, body, votes, comment_count, created_at and topic', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'body',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('GET request should allow for a ?sort_by query and ?order query and a ?limit defaulting to 10, allowing users to sort data by any of the columns - defaulting to date and descending respectively', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].created_at).to.equal('2018-11-15');
        expect(body.articles[2].created_at).to.equal('2010-11-17');
        expect(body.articles.length).to.be.lessThan(11);
      }));
    it('GET request should accept a ?limit, ?sort_by and ?order query', () => request
      .get('/api/articles?sort_by=article_id&order=asc&limit=2')
      .expect(200)
      .then(({ body }) => {
        // expect(body.articles[0].article_id).to.be.lessThan(body.articles[1].article_id);
        expect(body.articles.length).to.equal(2);
      }));
    it('GET request should accept a ?p query for pagination, with pages calculated based on the ?limit query', () => request
      .get('/api/articles?p=2&limit=2&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(3);
        expect(body.articles[1].article_id).to.equal(4);
      }));
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
