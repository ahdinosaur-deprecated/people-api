var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var Knex = require('knex');
var Bookshelf = require('bookshelf');
var feathers = require('feathers');
var _ = require('lodash');

var bob = {
  name: "Bob Loblaw",
  email: "bobloblawslawblog.com",
};

var aramis = {
  name: "Aramis",
  email: "aramis@3muskeeters.com"
};

var athos = {
  name: "Athos",
  email: "athos@3muskeeters.com"
};

var porthos = {
  name: "Porthos",
  email: "porthos$3muskeeters.com"
};

var checkPerson = function (actual, expected) {
  expect(actual).to.have.property("id");
  expect(actual).to.have.property("type", "Person");
  _.each(expected, function (value, key) {
    expect(actual).to.have.property(key, value);
  });
};

describe("#PersonService", function () {
  var knex, bookshelf, Person, Group, app;

  before(function () {
    var env = process.env.node_env || 'test';
    knex = Knex(require('../knexfile')[env]);
    bookshelf = require('bookshelf')(knex)

    Person = require('oa-person-db')(bookshelf);
    Group = require('oa-group-db')(bookshelf)
    
    app = feathers()
    .use(require('body-parser')())
    .configure(feathers.rest())
    .use('/people', require('../')(Person))
    .configure(feathers.errors())
    .setup()
    ;

    request = request(app);
  });

  it("should create Person", function () {
    var id;

    return request
    .post("/people")
    .send(bob)
    .expect("Content-Type", /json/)
    .expect(201)
    .then(function (res) {
      var person = res.body;
      expect(person['@context']).to.deep.equal(Person.context);
      checkPerson(person, bob)
      id = person.id;
    })
    .then(function () {
      return Person.forge({ id: id }).fetch();
    })
    .then(function (person) {
      checkPerson(person.toJSON(), bob);
    })
    ;
  });

  it("should get all Persons", function () {

    return Person.forge().save(bob)
    .then(function () {
      return request
      .get("/people")
      .expect("Content-Type", /json/)
      .expect(200)
      ;
    })
    .then(function (res) {
      var people = res.body;
      expect(people).to.have.length(1);
      var person = people[0];
      expect(person['@context']).to.deep.equal(Person.context);
      checkPerson(person, bob)
    })
    ;
  });

  it("should get a person", function () {

    return Person.forge().save(bob)
    .then(function (model) {
      return request
      .get("/people/" + model.id)
      .expect(200)
      ;
    })
    .then(function (res) {
      var person = res.body;
      expect(person['@context']).to.deep.equal(Person.context);
      checkPerson(person, bob)
    });
  });

  it("should update a person", function () {

    var newData = {
      name: "Bob Loblaw",
      email: "bobsnewemail@email.com",
    };

    return Person.forge().save(bob)
    .then(function (model) {
      return request
      .put("/people/" + model.id)
      .send(newData)
      .expect(200)
      ;
    })
    .then(function (res) {
      var person = res.body;
      expect(person['@context']).to.deep.equal(Person.context);
      checkPerson(person, newData)
    });
  });

  it("should delete a person", function () {
    var id;

    return Person.forge().save(bob)
    .then(function (model) {
      id = model.id

      // delete bob with api
      return request
      .delete("/people/" + id)
      .expect(204)
      ;
    })
    .then(function (res) {
      // get deleted bob from database
      return Person.forge({ id: id }).fetch()
    })
    .then(function (model) {
      expect(model).to.not.exist;

      // get deleted bob from api
      return request
      .get("/people/" + id)
      .expect(404)
      ;
    })
    ;
  });

  it("should batch create people", function () {
    // TODO
  })

  afterEach(function () {
    return Promise.all([
      knex('people').del(),
      knex('groups').del(),
      knex('members').del(),
    ]);
  });

  after(function () {
    return knex.destroy()
  });
});
