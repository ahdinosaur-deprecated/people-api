feathers = require('feathers')


module.exports = (db) ->
  feathers()
    .use('/people', require('./service')(db))