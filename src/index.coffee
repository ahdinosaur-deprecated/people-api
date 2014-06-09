feathers = require('feathers')
_ = require('lodash')
urlencode = require('urlencode')

module.exports = (db) ->
  feathers()
  .configure(feathers.rest())
  .use '/people', require('./service')(db)
  .use (err, req, res, next) ->

    res.status = err.status or 500

    res.format

      'application/json': () ->
        res.json(err)