express = require("express")
levelgraph = require("levelgraph")
jsonld = require("levelgraph-jsonld")
_ = require('lodash')

context = require("./context")

app = express()

app.use require("body-parser")()

module.exports = service = (db) ->
  db = jsonld(levelgraph(db))

  app.get "/people", (req, res, next) ->
    
    # TODO use searchStream and paginate
    # TODO get persons of @ids
    # search for all People
    db.search
      subject: db.v("@id")
      predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      object: "foaf:Person"
    , (err, people) ->
      
      # TODO handle error better
      return next(err)  if err
      
      # return success and people
      res.json 200, people

    return

  app.post "/people", (req, res, next) ->
    body = req.body

    body["@type"] = "foaf:Person"

    db.jsonld.put body, (err, obj) ->
      
      # TODO handle error better
      return next(err)  if err
      
      # return created and person
      res.json 201, obj

  app.get "/people/:id", (req, res, next) ->
    id = req.params.id

    db.jsonld.get id, context, (err, obj) ->
      
      # TODO handle error better
      return next(err) if err

      return res.json(404) unless obj

      res.json 200, obj

  app.put "/people/:id", (req, res, next) ->
    id = req.params.id
    body = req.body

    body["@type"] = "foaf:Person"

    if body['@id'] isnt id
      return res.json 400,
        error: "id in route does not match @id in body"

    db.jsonld.put body, (err, obj) ->

      # TODO handle error better
      return next(err) if err

      res.json 200, obj

  app.patch "/people/:id", (req, res, next) ->
    id = req.params.id
    updates = req.body

    body["@type"] = "foaf:Person"

    db.jsonld.get id, context, (err, oldObj) ->

      # TODO handle error better
      return next(err) if err

      return res.json(404) unless oldObj

      newObj = _.extend(oldObj, updates);

      db.jsonld.put newObj, (err, obj) ->

        # TODO handle error better
        return next(err)  if err

        res.json 200, obj


  app.delete "/people/:id", (req, res, next) ->

    id = req.params.id
    
    db.jsonld.del id, (err) ->

      # TODO handle error better
      return next(err) if err

      res.json 204

  app