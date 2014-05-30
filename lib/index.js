// Generated by CoffeeScript 1.7.1
(function() {
  var feathers, urlencode, _;

  feathers = require('feathers');

  _ = require('lodash');

  urlencode = require('urlencode');

  module.exports = function(db) {
    return feathers().use('/people', require('./service')(db)).use(function(req, res, next) {
      console.log(req.data, req.method);
      if (_.isEmpty(req.data)) {
        res.status = 204;
      }
      if (req.method === 'POST') {
        res.headers['Location'] = '/people/' + urlencode(req.data.id);
        res.status = 201;
      }
      return next();
    }).use(function(err, req, res, next) {
      res.status(err.status || 500);
      return res.format({
        'application/json': function() {
          return res.json(err);
        }
      });
    });
  };

}).call(this);