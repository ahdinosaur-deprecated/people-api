var express = require('express');
var levelgraph = require('levelgraph');
var jsonld = require('levelgraph-jsonld');

var app = express();
var db = jsonld(levelgraph('./db'));

app.use(require('body-parser')());

app.get('/groups', function (req, res, next) {
  // use db.search
  res.json(200, { name: "GET /groups"});
});

app.post('/groups', function (req, res, next) {
  var body = req.body;
  // use db.jsonld.put(body, function (err, obj) {})
  res.json(200, { name: "POST /groups"});
});

app.get('/groups/:id', function (req, res, next) {
  var id = req.params.id;
  // use db.jsonld.get(id, context, function (err, obj) {})
  res.json(200, { name: "GET /groups" + id });
});

app.put('/groups/:id', function (req, res, next) {
  var id = req.params.id;
  var body = req.body;
  // use db.jsonld.put(body, function (err, obj) {})
  res.json(200, { name: "PUT /groups/" + id });
});

app.delete('/groups/:id', function (req, res, next) {
  var id = req.params.id;
  // use db.jsonld.del(id, function (err) {})
  res.json(200, { name: "DELETE /groups" + id });
});

module.exports = app;