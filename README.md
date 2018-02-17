# Microservice Generator

This library creates a microservice based on express js and mongoose js which can do CRUD operation over HTTP using RESTful web service.


### Setup

Microservice Generator requires [Node.js](https://nodejs.org/) v4+ to run.


```sh
npm install --save microservice-generator
```

### Use like a node module

- import microservice-generator to your project and pass the schema json.

```sh
const mistor = require('microservice-generator');

var schema = {
    "name":"Hello World",
    "api":"/hello",
    "port":"9494",
    "database":"myApp",
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


### Use with command line interface

- clone microservice-generator to your workspace and pass the path of schema file.

```sh
git clone https://github.com/jugnuagrawal/microservice-generator.git
cd microservice-generator
node cli

Enter the path of your schema file : schema.json

#In the above example schema.json file is the microservice-generator folder

```


### Schema JSON Structure

```sh
{
    "name":"user", //Required. Name of this microservice
    "api":"/user", //Optional. API URL of this microservice
    "port":"9494", //Optional. Port number in which this microservice will be running
    "database":"myApp", //Optional. Name of database in which this microservice will create it's collection
    "schema":{
        //mongodb schema
    }
}
```
- Example mongodb schema
```sh
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

<!--[API Documentation](https://github.com/jugnuagrawal/microservice-generator/wiki)-->

License
----

MIT


**Open Source, Hell Yeah!**
