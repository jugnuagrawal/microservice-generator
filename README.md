# Microservice Generator

This tool creates a microservice based on express js and mongoose js which can do CRUD operation over HTTP using RESTful web service.


### Setup

Microservice Generator requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the tool.


```sh
cd microservice-generator
npm install
node index
```

### How to use

- Place you schema.json (can be any name) in the microservice-generator folder and run the above command
- Structure of schema.json

```
{
    "name":"user", //Required. Name of the microservice
    "api":"/user", //Optional. The API URL you want to expose
    "schema":{
        //any mongodb specification schema
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
