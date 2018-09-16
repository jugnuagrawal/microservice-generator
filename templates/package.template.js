const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name){
    return `
    {
        "name": "${_name}",
        "version": "1.0.0",
        "description": "A swagger express mongoose CRUD api",
        "main": "app.js",
        "scripts": {
          "start":"node app.js"
        },
        "keywords": [
          "CRUD",
          "Node",
          "JS",
          "Swagger"
          "Express",
          "Mongoose",
          "REST"
        ],
        "dependencies": {
          "body-parser": "^1.18.2",
          "express": "^4.16.2",
          "log4js": "^2.5.2",
          "mongoose": "^5.0.3",
          "js-yaml": "^3.12.0",
          "swagger-express-mw": "^0.7.0"
        },
        "author": "Jugnu Agrawal",
        "license": "ISC"
    }
    `;
}