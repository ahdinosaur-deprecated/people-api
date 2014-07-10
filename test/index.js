var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var Knex = require('knex');
var Bookshelf = require('bookshelf');
var feathers = require('feathers');
var errors = feathers.errors.types;
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
  var knex, bookshelf, Person, api;

  before(function () {
    var env = process.env.node_env || 'test';
    knex = Knex(require('../knexfile')[env]);
    bookshelf = require('bookshelf')(knex)

    require('oa-group-db')(bookshelf)
    Person = require('oa-person-db')(bookshelf);
    api = require('../')(Person);

    request = request(api);
  });

  /*
  it("should create Person", function () {
    var id;

    return request
    .post("/people")
    .send(bob)
    .expect("Content-Type", /json/)
    .expect(201)
    .then(function (res) {
      var person = res.body;
      expect(person).to.have.deep.property("@context", Person.context);
      checkPerson(person, bob)
      id = person.id;
    })
    .then(function () {
      return Person.forge({ id: id }).fetch();
    })
    .then(function (person) {
      checkPerson(person, bob);
    })
    ;
  });
  */

  it("should get all Persons", function () {

    return Person.forge().save(bob)
    .then(function () {
      return request
      .get("/people")
      .expect("Content-Type", /json/)
      .expect(200)
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

  /*
  it("should get a person", function () {

    return Person.forge().save(bob)
    .then(function () {
      return request
      .get("/people/" + stooge.key)
      .expect(200);
    })
    .then(function (res) {
      var thePerson = res.body;

      expect(thePerson["@context"]).to.deep.equal(Person.context);
      expect(thePerson).to.have.property("id");
      expect(thePerson).to.have.property("type", "Person");      
     
      delete thePerson['@context'];
      delete thePerson.id;
      delete thePerson.type;

      expect(thePerson).to.deep.equal(bob);
    });
  });

  it("should update a person", function () {

    var newData = {
      name: "Bob Loblaw",
      email: "bobsnewemail@email.com",
    };

    return Person.forge().save(bob)
    .then(function () {
      return request
      .put("/people/" + stooge.key)
      .send(newData)
      .expect(200);
    })
    .then(function (res) {
      var updatedPerson = res.body;

      expect(updatedPerson["@context"]).to.deep.equal(Person.context);
      expect(updatedPerson).to.have.property("id");
      expect(updatedPerson).to.have.property("type", "Person");      
     
      delete updatedPerson['@context'];
      delete updatedPerson.id;
      delete updatedPerson.type;

      expect(updatedPerson).to.deep.equal(newData);
    });
  });

  it("should delete a person", function () {

    return Person.forge().save(bob)
    .then(function () {
      // delete bob with API
      return request
      .delete("/people/" + stooge.key)
      .expect(204)
    })
    .then(function (res) {
      // get deleted bob
      var get = Person.getAsync(stooge.key);
      // TODO fix
      //expect(get).to.be.rejectedWith(errors.NotFound);
    });
  });

  it("should batch create people", function () {
    // TODO
  })
  */

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
