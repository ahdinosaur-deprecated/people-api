var request = require('supertest');
var expect = require('chai').expect;
var urlencode = require('urlencode');

var app, db;
var person;

describe("/people", function () {

  before(function () {
    db = require('level-test')()('testdb');
    app = require('../')(db);
  });

  it("should POST /people", function (done) {
    person = {
      "@id": "http://dinosaur.is#i",
      name: "Michael Williams",
    };

    request(app)
    .post('/people')
    .send(person)
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function (req) {
      var body = req.body;
      expect(body).to.have.property("@type", "foaf:Person");
      for (var prop in body) {
        expect(body).to.have.property(prop, body[prop]);
      }
    })
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });

  it("should GET /people", function (done) { 
    request(app)
    .get('/people')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function (req) {
      var body = req.body;
      expect(body).to.have.length(1);
      for (var prop in body[0]) {
        expect(body).to.have.property(prop, body[0][prop]);
      }
    })
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });

  it("should GET /people/:id", function (done) { 
    request(app)
    .get('/people/' + urlencode(person['@id']))
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(function (req) {
      var body = req.body;
      expect(body).to.have.property("@type", "foaf:Person");
      for (var prop in body) {
        expect(body).to.have.property(prop, body[prop]);
      }
    })
    .end(function(err, res){
      if (err) return done(err);
      done();
    });
  });
});