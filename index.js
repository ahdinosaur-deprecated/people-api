var debug = require('debug')("people-api:service");
var Proto = require('uberproto');
var _ = require('lodash');
var Promise = require('bluebird');

var Service = Proto.extend({
  init: function (Person) {
    debug("init", Person);
    this.Person = Person;
  },

  setup: function (app) {
    debug("setup", app);
    this.app = app;
    this.lookup = app.lookup.bind(app);
  },

  find: function (params) {
    params = params || {};
    return this.Person.forge()
    .query(params.query)
    .fetchAll({
      withRelated: [
        'memberOf.memberOf',
      ],
    })
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
    debug("get", id, params);
    params = params || {};

    return this.Person.forge({ id: id })
    .fetch({
      withRelated: [
        'memberOf.memberOf',
      ],
    })
    .bind(this)
    .then(function (model) {
      debug("model", model)

      if (_.isNull(model)) {
        throw new this.app.errors.NotFound('person '+id+' does not exist');
      }

      return _.extend(model.toJSON(), {
        "@context": this.Person.context,
      });
    })
    ;
  },

  create: function (data, params) {
    debug("create", data, params);
    params = params || {};

    // TODO create memberOf relations?

    return this.Person.forge()
    .save(data)
    .bind(this)
    .then(function (model) {
      return _.extend(model.toJSON(), {
        "@context": this.Person.context,
      });
    })
    ;
  },

  update: function (id, data, params) {
    debug("update", id, data, params);
    params = params || {};

    // TODO update memberOf relations

    return this.Person.forge({ id: id })
    .save(data, { patch: true })
    .bind(this)
    .then(function (model) {
      return this.get(id, params);
    })
    ;
  },

  remove: function (id, params) {
    debug("remove", id, params);
    params = params || {};

    // TODO remove memberOf relations

    return this.Person.forge({ id: id })
    .destroy()
    .return(null)
    ;
  },
});

module.exports = function (Person) {
  return Proto.create.call(Service, Person);
};

module.exports.Service = Service;
