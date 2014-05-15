var express = require('express');
var levelgraph = require('levelgraph');
var jsonld = require('levelgraph-jsonld');

var context = require('./context');

var app = express();

app.use(require('body-parser')());

module.exports = function service (db) {

  db = jsonld(levelgraph(db));

  app.get('/people', function (req, res, next) {
    
    // TODO use searchStream and paginate
    // TODO get persons of @ids
    // search for all People
    db.search({
      subject: db.v("@id"),
      predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      object: "foaf:Person",
    }, function (err, people) {
      // TODO handle error better
      if (err) { return next(err); }

      // return success and people
      res.json(200, people);
    });
  });

  app.post('/people', function (req, res, next) {
    var body = req.body;

    body["@type"] = "foaf:Person";

    db.jsonld.put(body, function (err, obj) {
      // TODO handle error better
      if (err) { return next(err); }

      // return success and person
      res.json(200, obj);
    })
  });

  app.get('/people/:id', function (req, res, next) {
    var id = req.params.id;

    db.jsonld.get(id, context, function (err, obj) {
      // TODO handle error better
      if (err) { return next(err); }
      if (!obj) { return res.json(404); }

      res.json(200, obj);
    })
  });

  app.put('/people/:id', function (req, res, next) {
    var id = req.params.id;
    var body = req.body;
    // use db.jsonld.put(body, function (err, obj) {})
    res.json(200, { name: "PUT /people/" + id });
  });

  app.delete('/people/:id', function (req, res, next) {
    var id = req.params.id;
    // use db.jsonld.del(id, function (err) {})
    res.json(200, { name: "DELETE /people" + id });
  });

  return app;
};