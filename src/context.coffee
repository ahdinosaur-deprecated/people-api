module.exports =
  "@language": "en"

  # aliases
  id: "@id",
  type: "@type",
  
  # prefixes
  circles: "http://circles.app.enspiral.com/"
  foaf: "http://xmlns.com/foaf/0.1/"
  people: "http://people.app.enspiral.com/"
  relations: "http://relations.app.enspiral.com/"
  schema: "https://schema.org/"
  
  # people
  name: "foaf:name"
  createdAt:
    "@id": "relations:createdAt"
    "@type": "schema:DateTime"

  modifiedAt:
    "@id": "relations:createdAt"
    "@type": "schema:DateTime"

  image: "foaf:Image"