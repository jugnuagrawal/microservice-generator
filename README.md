# Microservice Generator

This tool creates a microservice based on express js and mongoose js which can do CRUD operation over HTTP using RESTful web service.


### Setup

Microservice Generator requires [Node.js](https://nodejs.org/) v4+ to run.


```sh
npm install --save microservice-generator
```

### How to use

- import microservice-generator to your project and pass the schema json.

```
const mistor = require('microservice-generator');

var schema = {
    "name":"Hello World",
    "api":"/hello",
    "schema":{
        "from":{
            "type":"String",
            "required":true
        },
        "message":"String"
    }
}

mistor.createProject(schema);

```


### Schema JSON Structure

```
{
    "name":"user", //Required. Name of the microservice
    "api":"/user", //Optional. The API URL of the microservice
    "schema":{
        //mongodb schema
    }
}
```
- Example mongodb schema
```
{
    "name":"String",
    "email":{
        "type":"String",
        "unique":true,
        "required":true
    },
    "password":"String"
}
```
License
----

MIT


**Open Source, Hell Yeah!**
