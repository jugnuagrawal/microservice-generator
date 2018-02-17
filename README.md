# Microservice Generator

This library creates a microservice based on express js and mongoose js which can do CRUD operation over HTTP using RESTful web service.


### Setup

Microservice Generator requires [Node.js](https://nodejs.org/) v4+ to run.


### Use like a node module

```sh
npm install --save microservice-generator
```

- import microservice-generator to your project and pass the schema json.

```sh
const generator = require('microservice-generator');

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

generator.createProject(schema);

```


### Use with command line interface

- clone microservice-generator to your workspace and pass the path of schema file.

```sh
git clone https://github.com/jugnuagrawal/microservice-generator.git
cd microservice-generator
node cli

or

npm install microservice-generator
cd node_modules/microservice-generator
node cli

#After completing one of the above steps you will get a prompt

Enter the path of your schema file [default: sampleSchema.json] : schema.json

#In the above example schema.json file is the microservice-generator folder
#If you will not provide specify any file, it will take sampleSchema.json file present in the project folder
```


### Schema JSON Structure

```sh
{
    "name":"user", #Required. Name of this microservice
    "api":"/user", #Optional. API URL of this microservice
    "port":"9494", #Optional. Port number in which this microservice will be running
    "database":"myApp", #Optional. Name of database in which this microservice will create it's collection
    "schema":{
        #mongoose schema
    }
}
```
- Example mongoose schema
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
- [More info on mongoose schema](http://mongoosejs.com/docs/guide.html)

<!--[API Documentation](https://github.com/jugnuagrawal/microservice-generator/wiki)-->

License
----

MIT


**Open Source, Hell Yeah!**
