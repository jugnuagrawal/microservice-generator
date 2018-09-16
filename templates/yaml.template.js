const jsyaml = require('js-yaml');
const getParameters = [
    {
        name: "page",
        in: "query",
        type: "integer",
        description: "Page number to get the next set of documents"
    },
    {
        name: "count",
        in: "query",
        type: "integer",
        description: "Number of documents in each request"
    },
    {
        name: "filter",
        in: "query",
        type: "string",
        description: "Filter documents based on certain fields"
    },
    {
        name: "select",
        in: "query",
        type: "string",
        description: "Select fields to be displayed in documents"
    },
    {
        name: "sort",
        in: "query",
        type: "string",
        description: "Sort documents based on field"
    }
];
const showParameters = [
    {
        name: "select",
        in: "query",
        type: "string",
        description: "Select fields to be displayed in document"
    }, {
        name: "id",
        in: "path",
        type: "string",
        required: true,
        description: "Id of the document",
    }
];

function getDefinition(schema) {
    var definition = { properties: {} };
    Object.keys(schema).forEach(key => {
        if (!Array.isArray(schema[key]) && (schema[key] == 'String'
            || schema[key] == 'Number'
            || schema[key] == 'Boolean'
            || schema[key] == 'Date')) {
            definition.properties[key] = {};
            definition.properties[key]['type'] = [schema[key].toLowerCase(), 'null'];
        } else if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
            if (schema[key]['type'] && (schema[key]['type'] == 'String'
                || schema[key]['type'] == 'Number'
                || schema[key]['type'] == 'Boolean'
                || schema[key]['type'] == 'Date')) {
                definition.properties[key] = {};
                definition.properties[key]['type'] = [schema[key]['type'].toLowerCase(), 'null'];
            } else {
                definition.properties[key] = getDefinition(schema[key]);
            }
        } else {
            definition.properties[key] = {
                type: 'array',
                items: {}
            };
            if (typeof schema[key][0] == 'object') {
                definition.properties[key]['items'] = getDefinition(schema[key][0]);
            } else {
                definition.properties[key]['items']['type'] = [schema[key][0].toLowerCase(), 'null'];
            }
        }
    });
    return definition;
}

function getMethodNames(config) {
    var name = toCamelCase(config.name);
    var obj = {};
    obj.create = `${name}Create`;
    obj.retrive = `${name}Retrive`;
    obj.update = `${name}Update`;
    obj.delete = `${name}Delete`;
    obj.count = `${name}Count`;
    obj.controller = `index`;
    return obj;
}

function toCamelCase(name) {
    return name.split(' ').map((e, i) => i === 0 ? e : (e[0].toUpperCase() + e.substr(1, e.length))).join('');
}

function toPascalCase(name) {
    return name.split(' ').map(e => e[0].toUpperCase() + e.substr(1, e.length)).join('');
}

function getContent(config) {
    var methodName = getMethodNames(config);
    var definition = getDefinition(config.schema);
    var basePath = config.api ? toCamelCase(config.api) : '/' + toCamelCase(config.name);
    var swagger = {
        swagger: "2.0",
        info: {
            version: "1.0",
            title: config.name + " API"
        },
        host: "localhost:" + (config.port || 3000),
        basePath: '/',
        schemes: ["http"],
        consumes: ["multipart/form-data", "application/json"],
        produces: ["application/json", "text/plain"],
        paths: {},
        definitions: {}
    };
    var name = toCamelCase(config.name);
    swagger.definitions[`${name}_create`] = definition;
    swagger.paths[basePath + '/count'] = {
        "x-swagger-router-controller": `${methodName.controller}`,
        "get": {
            description: `Counts the number of ${name} documents`,
            operationId: `${methodName.count}`,
            parameters: [
                {
                    name: "filter",
                    in: "query",
                    type: "string",
                    description: "Filter documents based on certain fields"
                }
            ],
            responses: {
                "200": { description: "Number of records" },
                "400": { description: "Bad parameters" },
                "500": { description: "Internal server error" }
            }
        }
    };
    swagger.paths[basePath] = {
        "x-swagger-router-controller": `${methodName.controller}`,
        "get": {
            description: `Retrieve a array of ${name} documents`,
            operationId: `${methodName.retrive}`,
            parameters: getParameters,
            responses: {
                "200": { description: `Array of ${name} documents` },
                "400": { description: "Bad parameters" },
                "500": { description: "Internal server error" }
            }
        },
        "post": {
            description: `Create a new ${name} document`,
            operationId: `${methodName.create}`,
            parameters: [
                {
                    name: "data",
                    in: "body",
                    description: `Payload to create a ${name} document`,
                    schema: {
                        $ref: `#/definitions/${name}_create`
                    }
                }
            ],
            responses: {
                "200": { description: `${name} document with generated ID` },
                "400": { description: "Bad parameters" },
                "500": { description: "Internal server error" }
            }
        }
    };
    swagger.paths[basePath + "/{id}"] = {
        "x-swagger-router-controller": `${methodName.controller}`,
        "get": {
            description: `Retrieve a single record of ${name}`,
            operationId: `${methodName.retrive}`,
            parameters: showParameters,
            responses: {
                "200": { description: `${name} document for the ID` },
                "400": { description: "Bad parameters" },
                "404": { description: "No document found" },
                "500": { description: "Internal server error" }
            }
        },
        "put": {
            description: `Update a ${name} document`,
            operationId: `${methodName.update}`,
            parameters: [
                {
                    name: "data",
                    in: "body",
                    description: `Payload to update a ${name} document`,
                    schema: {
                        $ref: `#/definitions/${name}_create`
                    }
                }, {
                    name: "id",
                    in: "path",
                    type: "string",
                    required: true,
                    description: `Id of the ${name} document to be updated`,
                }
            ],
            responses: {
                "200": { description: `${name} document after update` },
                "400": { description: "Bad parameters" },
                "404": { description: "No document found" },
                "500": { description: "Internal server error" }
            }
        },
        "delete": {
            description: `Create a new ${name}`,
            operationId: `${methodName.delete}`,
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    required: true,
                    description: `Id of the ${name} document to be deleted`,
                }
            ],
            responses: {
                "200": { description: `Deleted ${name} document` },
                "400": { description: "Bad parameters" },
                "404": { description: "No document found" },
                "500": { description: "Internal server error" }
            }
        }
    };
    return jsyaml.dump(swagger);
}

module.exports.getContent = getContent;