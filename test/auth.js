const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/user');

describe('User', function () {
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
  });
  it('should not be able to login if they have not registered', function (done) {
    agent.post('/login', { email: 'wrong@example.com', password: 'nope' }).end(function (err, res) {
      res.should.have.status(401);
      done();
    });
  });

  it('should be able to signup', async function() {
    await User.findOneAndDelete({ username: 'testuser' });

    agent
      .post('/sign-up')
      .send({ username: 'testuser', password: 'mypassword' })
      .then(function (res) {
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
        done();
      })
      .catch(function (err) {
        done(err);
      });
    });

  it('should be able to login', function (done) {
    agent
      .post('/login')
      .send({ username: 'testuser', password: 'mypassword' })
      .then(function (res) {
        res.should.have.status(200);
        agent.should.have.cookie('nToken');
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('should be able to logout', function (done) {
    agent.get('/logout').end(function (err, res) {
      res.should.have.status(200);
      agent.should.not.have.cookie('nToken');
      done();
    })
    .catch(function (err) {
      done(err);
    });
  });

  after(function () {
    agent.close()
  });