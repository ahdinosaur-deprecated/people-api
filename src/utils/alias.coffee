module.exports = (obj, alias, actual) ->
  
  if not obj[actual] and obj[alias]
    obj[actual] = obj[alias]
    delete obj[alias]

  obj