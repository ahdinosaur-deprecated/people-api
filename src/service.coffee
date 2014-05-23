levelgraph = require("levelgraph")
jsonld = require("levelgraph-jsonld")
_ = require('lodash')

context = require("./context")

module.exports = service = (db) ->
  db = jsonld(levelgraph(db))

  return {
    find: (params, callback) ->
    
      # TODO use searchStream and paginate
      # TODO get persons of @ids
      # search for all people in database
      db.search
        subject: db.v("@id")
        predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        object: "foaf:Person"
      , (err, people) ->

        # if error, return error
        return callback(err) if err
        
        # return people
        callback(null, people)

    get: (id, params, callback) ->

      # get person by id in database
      db.jsonld.get id, context, (err, person) ->
        
        # if error, return error
        return callback(err) if err

        # if person not found, return 404
        if not person
          err = new Error("could not find @id " + id)
          err.status = 404
          return callback(err)

        # return person
        callback(null, person)


    create: (data, params, callback) ->

      data["@type"] = "foaf:Person"

      db.jsonld.put data, (err, person) ->
        
        # if error, return error
        return callback(err) if err
        
        # return person
        callback(null, person)


    update: (id, data, params, callback) ->

      data["@type"] = "foaf:Person"

      # if id in route doesn't match id in data, return 400
      if data['@id'] isnt id
        err = new Error("id in route does not match @id in data")
        err.status = 400
        return callback(err)

      # put person in database
      db.jsonld.put data, (err, person) ->

        # if error, return error
        return callback(err) if err

        # return person
        callback(null, person)

    patch: (id, data, params, callback) ->
      data["@type"] = "foaf:Person"

      # get existing Person by id in database
      db.jsonld.get id, context, (err, oldPerson) ->

        # if error, return error
          return callback(err) if err

        # if person not found, return 404
        if not person
          err = new Error("could not find @id " + id)
          err.status = 404
          return callback(err)

        # create new by extending old with update data 
        newPerson = _.extend(oldPerson, data);

        # put updated person in database
        db.jsonld.put newPerson, (err, person) ->

          # if error, return error
          return callback(err) if err

          # return person
          callback(null, person)

    remove: (id, params, callback) ->

      # delete person by id in database
      db.jsonld.del id, (err) ->

        # if error, return error
        return callback(err) if err

        # return person
        callback(null)
  }