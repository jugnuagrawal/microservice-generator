# Microservice Generator

This tool to generate microservice based on swagger, express js and mongoose js which can do CRUD operation using RESTful web service.


### Use like a node module

```sh
$ npm install --save microservice-generator
```

- import microservice-generator to your project and pass the schema json.

```javascript
const generator = require('microservice-generator');

var schema = {
    "name": "User Details",
    "api": "/user",
    "port": 3000,
    "database": "users",
    "schema": {
        "name": "String",
        "email": {
            "type": "String",
            "unique": true,
            "required": true
        },
        "password": "String",
        "contactNos": [
            {
                "code": "String",
                "number": "Number"
            }
        ],
        "gender": "String",
        "address": {
            "houseNo": "String",
            "street": "String",
            "city": "String",
            "state": "String",
            "country": "String",
            "pincode": "Number"
        }
    }
}

generator.createProject(schema);

```


### Use with command line interface

```sh
$ npm install -g microservice-generator

$ misgen -h

Usage: misgen [options] <name>

Options:

  -V, --version  output the version number
  -d, --dir      Directory name 
  -h, --help     output usage information


# [-d generates microservice for all the schema files in a directory
```

```sh

$ misgen schema.json

#The project folder will be generated at the location of schema.json file
```


### Schema JSON Structure

```javascript
{
    "name":"User Details", //Required. Name of this microservice
    "api":"/user", //Optional. API URL of this microservice
    "port":3000, //Optional. Port number in which this microservice will be running
    "database":"users", //Optional. Name of database in which this microservice will create it's collection
    "schema":{
        //mongoose schema
    }
}
```
- Example mongoose schema
```javascript
{
    "name": "String",
    "email": {
        "type": "String",
        "unique": true,
        "required": true
    },
    "password": "String",
    "contactNos": [
        {
            "code": "String",
            "number": "Number"
        }
    ],
    "gender": "String",
    "address": {
        "houseNo": "String",
        "street": "String",
        "city": "String",
        "state": "String",
        "country": "String",
        "pincode": "Number"
    }
}
```
- [More info on mongoose schema](http://mongoosejs.com/docs/guide.html)

<!--[API Documentation](https://github.com/jugnuagrawal/microservice-generator/wiki)-->

License
----

MIT
