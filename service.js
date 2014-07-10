var Proto = require('uberproto');
var errors = require('feathers').errors.types;
var _ = require('lodash');
var Promise = require('bluebird');

var Service = Proto.extend({
  init: function (Person) {
    this.Person = Person;
  },

  setup: function (app) {
    this.lookup = app.lookup.bind(app);
  },

  find: function (params) {
    params = params || {};
    return this.Person.forge()
    .query(params.query)
    .fetchAll({ withRelated: ['memberOf.memberOf']})
    .bind(this)
    .then(function (collection) {
      return Promise.map(collection.models, function (model) {
        return _.extend(model.toJSON(), {
          "@context": this.Person.context,
        });
      }.bind(this));
    })
    ;
  },

  get: function (id, params) {
    params = params || {};
    return this.Person.forge({ id: id })
    .fetch({ withRelated: ['memberOf.memberOf'] })
    .bind(this)
    .then(function (model) {
      if (_.isNull(model)) {
        return new errors.NotFound("person "+id+" not found.")
      }
      return _.extend(model.toJSON(), {
        "@context": this.Person.context,
      });
    })
    ;
  },

  /*
  create: function (data, params) {
    params = params || {};
    var Domain = this.Domain;

    // get promise object for possible nested objects
    var objPromise = utils.promiseObject(Domain, this.lookup, data);

    // resolve nested objects
    return Promise.props(objPromise)
    .bind(this)
    .then(function (obj) {
      // create Domain model
      var model = Promise.promisifyAll(Domain.create(obj));
      // save model
      return model.saveAsync()
      .bind(this)
      .then(function () {
        // return full model
        return this.get(model.key, params);
      })
      ;
    })
    ;
  },

  update: function (id, data, params) {
    params = params || {};
    var Domain = this.Domain;
    
    // get promise object for possible nested objects
    var objPromise = utils.promiseObject(Domain, this.lookup, data);

    // resolve promise object
    return Promise.props(objPromise)
    .bind(this)
    .then(function (updates) {
      // update Domain model
      return Domain.updateAsync(id, updates, params);
    })
    .then(function () {
      // return full model
      return this.get(id, params);
    })
    ;
  },

  remove: function (id, params, callback) {
    params = params || {};

    // delete model by id
    return this.Domain.deleteAsync(id, params)
    .bind(this)
    // if model is not found, return not NotFound error
    .catch(function (err) {
      // TODO not all errors mean not found
      if (err) { return new errors.NotFound(id + ' does not exist'); }
    })
    // if successful, return nothing
    .then(function () {
      return null;
    })
    ;
  },
  */
});

module.exports = function (Person) {
  return Proto.create.call(Service, Person);
};

module.exports.Service = Service;
