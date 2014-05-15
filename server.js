var level = require('level');
var db = level('./db');

var app = require('./')(db);

app.listen(5000);