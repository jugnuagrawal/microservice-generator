# Microservice Generator

This library creates a microservice based on express js and mongoose js which can do CRUD operation over HTTP using RESTful web service.


### Setup

Microservice Generator requires [Node.js](https://nodejs.org/) v4+ to run.


### Use like a node module

```sh
$ npm install --save microservice-generator
```

- import microservice-generator to your project and pass the schema json.

```javascript
const generator = require('microservice-generator');

var schema = {
    "name":"Hello World",
    "api":"/hello",
    "port":3000,
    "database":"myApp",
    "schema":{
        "from":{
            "type":"String",
            "required":true
        },
        "message":"String"
    }
}

generator.createProject(schema);

```


### Use with command line interface

```sh
$ npm install -g microservice-generator

$ misgen

Enter the full path of your schema file [sampleSchema.json] : /usr/home/workspace/schema.json

#The project folder will be generated at the location of schema.json file
```


### Schema JSON Structure

```javascript
{
    "name":"user", //Required. Name of this microservice
    "api":"/user", //Optional. API URL of this microservice
    "port":9494, //Optional. Port number in which this microservice will be running
    "database":"myApp", //Optional. Name of database in which this microservice will create it's collection
    "schema":{
        //mongoose schema
    }
}
```
- Example mongoose schema
```javascript
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
- [More info on mongoose schema](http://mongoosejs.com/docs/guide.html)

<!--[API Documentation](https://github.com/jugnuagrawal/microservice-generator/wiki)-->

License
----

MIT


**Open Source, Hell Yeah!**
