// test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
chai.use(chaiHttp);
const app = require('../server');
const agent = chai.request.agent(app);
const User = require('../models/user');
const Post = require('../models/post');

const should = chai.should();

describe('Posts', () => {
  // Post that we'll use for testing purposes
  const newPost = {
    title: 'post title',
    url: 'https://www.google.com',
    summary: 'post summary'
  };
  const user = {
    username: 'poststest',
    password: 'testposts'
  };
  before (function (done) {
    agent
      .post('/sign-up')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .then(function () { 
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
  it('should create with valid attributes at POST /posts/new', function(done){
     // Checks how many posts there are now
    console.log("starting test")
    Post.estimatedDocumentCount()
    
    .then((initialDocCount) => {
      agent
        .post('/posts/new')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newPost)
        .then((res) => {          
          Post.estimatedDocumentCount()
            .then((newDocCount) => {
              console.log("new post count")
              // Check that the database has status 200
              res.should.have.status(200);
              console.log("status 200")
              // Check that the database has one more post in it
              newDocCount.should.equal(initialDocCount + 1)
              console.log("new post count: " + newDocCount)
              done();
            })
            .catch((err) => {
              console.log("error 1")
              done(err);
            });
        })
        .catch((err) => {
          console.log("error 2")
          done(err);
        });
      })
      .catch((err) => {
        console.log("error 3")
        done(err);
      });
  });

  after(function (done) {
    console.log("starting after block")
    Post.findOneAndDelete(newPost)
      .then(function () {
        agent.close();
        console.log("agent closed")

        User
          .findOneAndDelete({
            username: user.username,
          })
          .then(function () {
            console.log("user deleted")
            done();
          })
          .catch(function (err) {
            console.log("user delete error")
            done(err);
          });
      })
      .catch(function (err) {
        console.log("post delete error")
        done(err);
      });
    });
  });