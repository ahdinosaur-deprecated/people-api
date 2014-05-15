var request = require('supertest');
var expect = require('chai').expect;

var app = require('../')

describe("GET /groups", function () {
  it("should GET /groups", function (done) { 
    request(app)
      .get('/groups')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (req) {
        expect(req.body).to.deep.equal({ name: "GET /groups" });
      })
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });
});