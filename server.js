var feathers = require('feathers');
var env = process.env.node_env || 'development';
var knex = require('knex')(require('./knexfile')[env]);
var bookshelf = require('bookshelf')(knex)

var Person = require('oa-person-db')(bookshelf);
var Group = require('oa-group-db')(bookshelf);

return feathers()
.use(require('body-parser')())
.configure(feathers.rest())
.use('/people', require('./')(Person))
.configure(feathers.errors())
.setup()
.listen(5000);
