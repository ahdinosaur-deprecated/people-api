var feathers = require('feathers');

module.exports = function (Person) {

  return feathers()
  .configure(feathers.rest())
  .use(require('body-parser')())
  .use('/people', require('./service')(Person))
  .setup()
}
