const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/user');

describe('User', function () {
  it('should not be able to login if they have not registered', function (done) {
    agent.post('/login', { email: 'wrong@example.com', password: 'nope' }).end(function (err, res) {
      res.should.have.status(401);
      done();
    });
  });

  it ('should be able to signup', function (done) {
    User.findOneAndRemove({ username: 'test1' }, function () {
      agent
        .post('/sign-up')
        .send({ username: 'test1', password: 'password' })
        .end(function (err, res) {
          console.log(res.body);
          res.should.have.status(200);
          agent.should.have.cookie('nToken');
          done();
        });
    });
  });

  after(function () {
    agent.close()
  });

});