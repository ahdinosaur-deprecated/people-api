feathers = require('feathers')
_ = require('lodash')
urlencode = require('urlencode')

module.exports = (db) ->
  feathers()
  .use '/people', require('./service')(db)
  .use (req, res, next) ->
    console.log(req.data, req.method)

    if _.isEmpty(req.data)
      res.status = 204

    if req.method == 'POST'
      res.headers['Location'] =
        '/people/' + urlencode(req.data.id)
      res.status = 201

    next()
  .use (err, req, res, next) ->

    res.status = err.status or 500

    res.format

      'application/json': () ->
        res.json(err)