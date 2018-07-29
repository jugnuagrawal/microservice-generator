const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name){
    return `
    {
        "name": "${_name}",
        "version": "1.0.0",
        "description": "A node js project created with microservice-generator to do CRUD operation over REST API for the given schema structure.",
        "main": "app.js",
        "scripts": {
        },
        "keywords": [
          "CRUD",
          "Node",
          "JS",
          "Express",
          "Mongoose",
          "REST"
        ],
        "dependencies": {
          "body-parser": "^1.18.2",
          "ejs": "^2.5.7",
          "express": "^4.16.2",
          "log4js": "^2.5.2",
          "mongoose": "^5.0.3"
        },
        "author": "Jugnu Agrawal",
        "license": "ISC"
    }
    `;
}