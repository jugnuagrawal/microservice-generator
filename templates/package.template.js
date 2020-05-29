function getContent(data) {
  return `
{
    "name": "${data.nameKebabCase}",
    "version": "1.0.0",
    "description": "A JSON Schema express CRUD",
    "main": "app.js",
    "scripts": {
      "start":"node app.js"
    },
    "keywords": [
      "CRUD",
      "Node",
      "JS",
      "Swagger",
      "Express",
      "Mongoose",
      "REST"
    ],
    "dependencies": {
      "ajv": "^6.12.2",
      "express": "^4.17.1",
      "lodash": "^4.17.15",
      "log4js": "^6.3.0",
      "mongodb": "^3.5.8"
    },
    "author": "Jugnu Agrawal",
    "license": "ISC"
}
    `;
}

module.exports.getContent = getContent;