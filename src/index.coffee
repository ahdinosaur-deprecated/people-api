feathers = require('feathers')


module.exports = (db) ->
  feathers()
  .use '/people', require('./service')(db)
  .use (err, req, res, next) ->
    res.status(err.status or 500)

    console.log(err)

    res.format

      'application/json': () ->
        res.json(err)