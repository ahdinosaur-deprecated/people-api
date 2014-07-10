var env = process.env.node_env || 'development';
var knex = require('knex')(require('./knexfile')[env]);
var bookshelf = require('bookshelf')(knex)

var Person = require('oa-person-db')(bookshelf);
var Group = require('oa-group-db')(bookshelf);
var api = require('./')(Person);

api.listen(5000);
