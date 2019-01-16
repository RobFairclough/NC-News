process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);
const test405 = (invalidMethods, path) => {
  const invalidRequests = invalidMethods.map(method => request[method](path).expect(405));
  return Promise.all(invalidRequests);
};
describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => {
    connection.destroy();
  });
  it('GET request should respond with a JSON object describing all available endpoints on the API', () => request.get('/api').expect(200));

  describe('/topics', () => {
    const topicsUrl = '/api/topics';
    it('GET request at /topics should return status 200 and an array of topic objects, each having a slug and description property', () => request
      .get(topicsUrl)
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
        .post(topicsUrl)
        .send(testObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.eql(testObj);
        });
    });
    it('POST request at /topics should only accept the slug if unique and when failing should respond status 422', () => {
      const testObj = { slug: 'mitch', description: 'duplicate slug' };
      return request
        .post(topicsUrl)
        .send(testObj)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('Key (slug)=(mitch) already exists.');
        });
    });
    it('POST request at /topics should not accept the request if missing a description', () => {
      const testObj = { slug: 'test' };
      return request
        .post(topicsUrl)
        .send(testObj)
        .expect(400);
    });
    it('POST request at /topics should not accept the request if missing a slug', () => {
      const testObj = { description: 'test' };
      return request
        .post(topicsUrl)
        .send(testObj)
        .expect(400);
    });
    it('Invalid request methods should return status 405', () => {
      const invalidMethods = ['put', 'patch', 'delete'];
      test405(invalidMethods, topicsUrl).then(([response]) => {
        expect(response.statusCode).to.equal(405);
      });
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
      it('POST request should return status 400 if the topic is not in the db', () => request
        .post('/api/topics/dogs/articles')
        .send({
          title: 'The 25 dog-based languages you NEED to learn',
          username: 'rogersop',
          body: 'C(anine), Pupthon, Pupy, ChiuauaScript, Doge.js, Dolang, matLabrador',
        })
        .expect(400));
      it('POST request should return 400 if the username is not in the db', () => request
        .post('/api/topics/cats/articles')
        .send({
          title:
              'Why its not a bad thing that cats leave dead birds and rodents in your house, and fun DIY recipes to make use of them!',
          username: 'notACat',
          body: 'cook the birb pls',
        })
        .expect(400));
      it('invalid request methods should return status 405', () => {
        const invalidMethods = ['put', 'patch', 'delete'];
        test405(invalidMethods, '/api/topics/cats/articles').then(([response]) => expect(response.statusCode).to.equal(405));
      });
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
    it('Invalid request methods should return status 405', () => {
      const invalidMethods = ['post', 'put', 'patch', 'delete'];
      test405(invalidMethods, '/api/articles').then(([response]) => expect(response.statusCode).to.equal(405));
    });

    describe('/:article_id', () => {
      it('GET request should return status 200 and an article object with properties article_id, author, title, votes, body, comment_count, created_at and topic', () => request
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).to.equal(1);
          expect(body.article.author).to.equal('butter_bridge');
          expect(body.article.title).to.equal('Living in the shadow of a great man');
          expect(body.article.comment_count).to.equal('13');
        }));
      it('GET request should return status 404 if no article exists with that id', () => request.get('/api/articles/8008').expect(404));
      it('GET request should return status 400 if the article id passed is not an integer', () => request.get('/api/articles/myidisinmyotherpants').expect(400));

      it('PATCH request should accept an object in the form {inc_votes: newVote}, responding with a status code of 200 and an object of the updated article with votes increased for a positive number', () => request
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(101);
        }));
      it('PATCH request should accept an object in the form {inc_votes: newVote}, responding with a status code of 200 and an object of the updated article with votes decreased for a negative number', () => request
        .patch('/api/articles/1')
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(0);
        }));
      it('PATCH request should respond status code 400 if not given required data', () => request
        .patch('/api/articles/2')
        .send({ my_vote_is_that_the_article_should_gain_votes_in_the_number_of: 5 })
        .expect(400));
      it('PATCH request should respond status code 400 if given invalid article_id', () => request
        .patch('/api/articles/buspass')
        .send({ inc_votes: 5 })
        .expect(400));
      it('PATCH request should respond status code 404 if no article with that id exists', () => request
        .patch('/api/articles/12345')
        .send({ inc_votes: 5 })
        .expect(404));

      it('DELETE request should delete the article with given id, and respond status 204 and no-content', () => request
        .delete('/api/articles/1')
        .expect(204)
        .then(() => request.get('/api/articles/1').expect(404)));
      it('DELETE request should cascade delete all comments about that article', () => request
        .delete('/api/articles/2')
        .expect(204)
        .then(() => connection('comments')
          .where('article_id', '2')
          .then((comments) => {
            expect(comments.length).to.equal(0);
          })));
      it('DELETE request should return status 404 if no article exists with given id', () => request.delete('/api/articles/2113').expect(404));
      it('DELETE request should return status 400 if given an invalid article id', () => request.delete('/api/articles/ctrlalt').expect(400));
      it('Invalid request methods should return status 405', () => {
        const invalidMethods = ['put', 'post'];
        test405(invalidMethods, '/api/articles/1').then(([response]) => expect(response.statusCode).to.equal(405));
      });

      describe('/comments', () => {
        it('GET request should respond with status 200 and an array of comments, each having properties comment_id, votes, created_at, author and body', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.have.all.keys(
              'comment_id',
              'votes',
              'created_at',
              'author',
              'body',
            );
          }));
        it('GET request should accept a ?limit, ?sort_by and ?sort_ascending query, defaulting to 10, date and false respectively', () => request
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(10);
            expect(body.comments[0].created_at).to.equal('2016-11-22');
            expect(body.comments[9].created_at).to.equal('2007-11-25');
          }));
        it('GET request should accept a ?limit, ?sort_by and ?sort_ascending query, which can be set by the user', () => request
          .get('/api/articles/1/comments?limit=5&sort_by=comment_id&sort_ascending=true')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(5);
            expect(body.comments[0].comment_id).to.be.lessThan(body.comments[1].comment_id);
          }));
        it('GET request should accept a ?p query for pagination, with pages calculated based on the ?limit query', () => request
          .get('/api/articles/1/comments?limit=2&p=3')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(2);
            expect(body.comments[0].comment_id).to.equal(6);
          }));

        it('POST request should accept an object with username and body propeties, and respond with the posted comment and status 201 if successful', () => request
          .post('/api/articles/4/comments')
          .send({ username: 'icellusedkars', body: 'where me keys?' })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.body).to.equal('where me keys?');
            return request
              .get('/api/articles/4/comments')
              .expect(200)
              .then((obj) => {
                expect(obj.body.comments[obj.body.comments.length - 1].body).to.equal(
                  'where me keys?',
                );
              });
          }));
        it('POST request should respond status code 400 if not given required data', () => request
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop', sad: true })
          .expect(400));
        it('POST request should respond status code 400 if not given an existing username', () => request
          .post('/api/articles/1/comments')
          .send({ username: 'therealdonaldtrump', body: 'this is SAD and so am I' })
          .expect(400));
        it('POST request should respond status code 400 if posted to an article ID that doesnt exist', () => request
          .post('/api/articles/6969/comments')
          .send({ username: 'icellusedkars', body: 'real comment' })
          .expect(400));
        it('Invalid request methods should return status 405', () => {
          const invalidMethods = ['put', 'patch', 'delete'];
          test405(invalidMethods, '/api/articles/1/comments').then(([response]) => expect(response.statusCode).to.equal(405));
        });
        describe('/:comment_id', () => {
          it('PATCH request should accept an object in the form {inc_votes: newVote}, responding with a status code of 200 and an object of the updated article ', () => request
            .patch('/api/articles/1/comments/2')
            .send({ inc_votes: 6 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(20);
            }));
          it('PATCH request should respond status code 400 if not given required data', () => request
            .patch('/api/articles/1/comments/2')
            .send({ this: 'is a good comment and I like it' })
            .expect(400));
          it('PATCH request should respond status code 404 if no comment exists with the given id', () => request
            .patch('/api/articles/1/comments/246810')
            .send({ inc_votes: 45 })
            .expect(404));

          it('DELETE request should delete given comment by comment_id, and respond with status 204', () => request.delete('/api/articles/1/comments/2').expect(204));
          it('DELETE request return status code 404 if comment_id does not exist', () => request.delete('/api/articles/1/comments/1234').expect(404));
          it('Invalid request methods should return status 405', () => {
            const invalidMethods = ['get', 'put', 'post'];
            test405(invalidMethods, '/api/articles/1/comments/2').then(([response]) => expect(response.statusCode).to.equal(405));
          });
        });
      });
    });
  });

  describe('/users', () => {
    it('GET request should respond status 200 and give an array of user objects with properties username, avatar_url, name', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users[0]).to.have.all.keys('username', 'avatar_url', 'name');
        expect(body.users.length).to.equal(3);
      }));
    it('Invalid request methods should return status 405', () => {
      const invalidMethods = ['put', 'patch', 'delete', 'post'];
      test405(invalidMethods, '/api/users');
    });
    describe('/users/:username', () => {
      it('GET request should respond status 200 and give a user object with properties username, avatar_url, name', () => request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).to.equal('butter_bridge');
          expect(body.user.name).to.equal('jonny');
          expect(body.user.avatar_url).to.equal(
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          );
        }));
      it('GET request should respond status 404 if no users exist by that usename', () => request.get('/api/users/robfairclough').expect(404));
      it('Invalid request methods should return status 405', () => {
        const invalidMethods = ['put', 'patch', 'delete'];
        test405(invalidMethods, '/api/users/butter_bridge').then(([response]) => expect(response.statusCode).to.equal(405));
      });
    });
  });
  describe.only('/login', () => {
    it('should not login with an incorrect password', () => request
      .post('/login')
      .send({ username: 'rob', password: 'WRONG' })
      .expect(401));
    it('should accept a correct password and respond with a token', () => request
      .post('/login')
      .send({ username: 'rob', password: 'password' })
      .expect(200)
      .then(({ body }) => {
        expect(body).to.have.property('token');
      }));
  });
});
