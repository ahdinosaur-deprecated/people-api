request = require("supertest")
expect = require("chai").expect
urlencode = require("urlencode")

app = undefined
db = undefined
graphdb = undefined

context = require('../lib/context')

person =
  '@id': "http://dinosaur.is#i"
  '@type': 'foaf:Person'
  name: "Michael Williams"

describe "#people", ->
  before ->
    db = require("level-test")()("testdb")
    graphdb = require('levelgraph-jsonld')(require('levelgraph')(db))
    app = require('../')(db)
    request = request(app)
    return

  it "should POST /people", (done) ->
    request
    .post("/people")
    .send(person)
    .expect("Content-Type", /json/)
    .expect(201)
    .end (err, res) ->
      return done(err) if err
      graphdb.jsonld.get person['@id'], context, (err, body) ->
        return done(err) if err
        for prop of body
          expect(body).to.have.property prop, person[prop]
        done()

  it "should GET /people", (done) ->

    graphdb.jsonld.put person, (err) ->
      expect(err).to.not.exist

      request
      .get("/people")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect (req) ->
        body = req.body
        expect(body).to.have.length(1)
        for prop of body[0]
          expect(body[0]).to.have.property prop, person[prop]
        return
      .end (err, res) ->
        return done(err) if err
        done()

  it "should GET /people/:id", (done) ->
      graphdb.jsonld.put person, (err, obj) ->
        expect(err).to.not.exist

        request
        .get("/people/" + urlencode(obj['@id']))
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((req) ->
          body = req.body
          for prop of body
            expect(body).to.have.property prop, person[prop]
          return)
        .end((err, res) ->
          return done(err)  if err
          done())

  it "should GET /people/:shortID", (done) ->
    graphdb.jsonld.put person, (err, obj) ->
        expect(err).to.not.exist

        request
        .get("/people/" + urlencode(person['@id']))
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((req) ->
          body = req.body
          expect(body).to.exist
          for prop of body
            expect(body).to.have.property prop, person[prop]
          return)
        .end((err, res) ->
          return done(err)  if err
          done())

  it "should PUT /people/:id", (done) ->
    person["name"] = "Mikey Williams"
    body = undefined

    request
    .put("/people/" + urlencode(person['@id']))
    .send(person)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((req) ->
      body = req.body
      for prop of body
        expect(body).to.have.property prop, person[prop]
      return)
    .end (err, res) ->
      graphdb.jsonld.get body.id, context, (err, body) ->
        return done(err) if err
        for prop of body
          expect(body).to.have.property prop, person[prop]
        done()

  it "should DELETE /people/:id", (done) ->

    graphdb.jsonld.put person, (err, obj) ->
      expect(err).to.not.exist
      expect(obj).to.exist

      request
      .del("/people/" + urlencode(person['@id']))
      .expect(200) # TODO 204
      .end (err, res) ->
        graphdb.jsonld.get obj['@id'], context, (err, body) ->
          expect(err).to.not.exist
          expect(body).to.not.exist
          done()

  afterEach (done) ->
      # del all objects in db
      db.createKeyStream()
      .on 'data', (k) ->
        db.del(k)
      .on 'close', ->
        done()

  @