_ = require('lodash')

module.exports = (obj, type) ->
  
  if not _.isString(obj['@type']) and
  not _.isArray(obj['@type'])

    obj['@type'] = type

  else if _.isString(obj['@type']) and
  obj['@type'] != type
    
    obj['@type'] = [obj['@type'], type]

  else if _.isArray(obj['@type']) and
  not _.contains(obj['@type'], type)

    obj['@type'].push(type)

  obj