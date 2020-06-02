# Microservice Generator

A node js tool to generate a microservice to do CRUD operation over REST API for the given JSON Schema.

## Quick Use

```sh
npm install -g @agtech/ms-gen

msgen <JSON_SCHEMA_FILE>

# The project will be generated in the same folder where JSON_SCHEMA_FILE file is present.
```

### Use like a node module

```sh
$ npm install --save @agtech/ms-gen
```

- import @agtech/ms-gen to your project and pass the schema json.

```javascript
const generator = require("@agtech/ms-gen");

var data = {
  name: "User Details",
  api: "/user",
  port: 3000,
  database: "users",
  schema: {
    //JSON schema
  },
};

generator.createProject(data);
```

### Full CLI Example

```sh
$ npm install -g @agtech/ms-gen

$ msgen -h

Usage: msgen [options] <name>

Options:

  -V, --version  output the version number
  -d, --dir      Directory name
  -h, --help     output usage information


# [-d generates microservice for all the schema files in a directory
```

```sh

$ msgen schema.json

#The project folder will be generated at the location of schema.json file
```

### JSON Data Structure

```javascript
{
    "name":"User Details", //Required. Name of this microservice
    "api":"/user", //Optional. API URL of this microservice
    "port":3000, //Optional. Port number in which this microservice will be running
    "database":"users", //Optional. Name of database in which this microservice will create it's collection
    "schema":{
        //JSON schema
    }
}
```

- Example JSON schema

```javascript
{
    "$id": "https://example.com/person.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Person",
    "type": "object",
    "properties": {
        "firstName": {
        "type": "string",
        "description": "The person's first name."
        },
        "lastName": {
        "type": "string",
        "description": "The person's last name."
        },
        "age": {
        "description": "Age in years which must be equal to or greater than zero.",
        "type": "integer",
        "minimum": 0
        }
    }
}
```

- [More info on JSON schema](https://json-schema.org/learn/getting-started-step-by-step.html)

<!--[API Documentation](https://github.com/jugnuagrawal/microservice-generator/wiki)-->

## License

MIT
