request = require("supertest")
expect = require("chai").expect
urlencode = require("urlencode")

app = undefined
db = undefined
person = undefined

describe "/people", ->
  before ->
    db = require("level-test")()("testdb")
    app = require("../src")(db)
    return

  it "should POST /people", (done) ->
    person =
      "@id": "http://dinosaur.is#i"
      name: "Michael Williams"

    request(app)
    .post("/people")
    .send(person)
    .expect("Content-Type", /json/)
    .expect(201).expect((req) ->
      body = req.body

      expect(body).to.have.property "@type", "foaf:Person"
      for prop of body
        expect(body).to.have.property prop, body[prop]
      return
    )
    .end((err, res) ->
      return done(err) if err
      done()
    )

  it "should GET /people", (done) ->
    request(app)
    .get("/people")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((req) ->
      body = req.body

      expect(body).to.have.length 1
      for prop of body[0]
        expect(body[0]).to.have.property prop, body[0][prop]
      return
    )
    .end((err, res) ->
      return done(err)  if err
      done()
    )

  it "should GET /people/:id", (done) ->
    request(app)
    .get("/people/" + urlencode(person["@id"]))
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((req) ->
      body = req.body

      expect(body).to.have.property "@type", "foaf:Person"
      for prop of body
        expect(body).to.have.property prop, body[prop]
      return
    )
    .end((err, res) ->
      return done(err)  if err
      done()
    )

  it "should PUT /people/:id", (done) ->
    person["name"] = "Mikey Williams"

    request(app)
    .put("/people/" + urlencode(person["@id"]))
    .send(person)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect( (req) ->
      body = req.body

      expect(body).to.have.property "@type", "foaf:Person"
      for prop of body
        expect(body).to.have.property prop, body[prop]
      return
    )
    .end((err, res) ->
      return done(err) if err
      done()
    )

  it "should DELETE /people/:id", (done) ->
    request(app)
    .delete("/people/" + urlencode(person["@id"]))
    .expect("Content-Type", /json/)
    .expect(204)
    .end((err, res) ->
      return done(err) if err
      done()
    )

  it "should not GET deleted id", (done) ->
    request(app)
    .get("/people/" + urlencode(person["@id"]))
    .expect("Content-Type", /json/)
    .expect(404)
    .end((err, res) ->
      return done(err)  if err
      done()
    )