const getParameters = [
    {
        name: "page",
        in: "query",
        type: "integer",
        description: "Page number of the request"
    },
    {
        name: "count",
        in: "query",
        type: "integer",
        description: "Number of categories per page"
    },
    {
        name: "filter",
        in: "query",
        type: "string",
        description: "Filter categories based on certain fields"
    },
    {
        name: "select",
        in: "query",
        type: "string",
        description: "Comma seperated fields to be displayed"
    },
    {
        name: "sort",
        in: "query",
        type: "string",
        description: "sort parameter"
    }
];
const showParameters = [
    {
        name: "filter",
        in: "query",
        type: "string",
        description: "Filter categories based on certain fields"
    },
    {
        name: "select",
        in: "query",
        type: "string",
        description: "Comma seperated fields to be displayed"
    }, {
        name: "id",
        in: "path",
        type: "string",
        required: true,
        description: "Id of the object to be updated",
    }
];

function getDefinition(schema) {
    var definition = { type: 'object', properties: {} };
    Object.keys(schema).forEach(key => {
        if (!Array.isArray(schema[key]) && (schema[key] == 'String'
            || schema[key] == 'Number'
            || schema[key] == 'Boolean'
            || schema[key] == 'Date')) {
            definition.properties[key] = {};
            definition.properties[key]['type'] = schema[key].toLowerCase();
        } else if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
            if (schema[key]['type'] && (schema[key]['type'] == 'String'
                || schema[key]['type'] == 'Number'
                || schema[key]['type'] == 'Boolean'
                || schema[key]['type'] == 'Date')) {
                definition.properties[key] = {};
                definition.properties[key]['type'] = schema[key]['type'].toLowerCase();
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
                definition.properties[key]['items']['type'] = schema[key][0].toLowerCase();
            }
        }
    });
    return definition;
}

function getMethodNames(config) {
    var name = toCamelCase(config.name);
    var obj = {};
    obj.create = `${name}Create`;
    obj.list = `${name}List`;
    obj.retrive = `${name}Retrive`;
    obj.update = `${name}Update`;
    obj.delete = `${name}Delete`;
    obj.controller = "controller";
    return obj;
}

function toCamelCase(name) {
    return name.split(' ').map((e, i) => i === 0 ? e : (e[0].toUpperCase() + e.substr(1, e.length))).join('');
}

function toPascalCase(name) {
    return name.split(' ').map(e => e[0].toUpperCase() + e.substr(1, e.length)).join('');
}

function generateYaml(config) {
    var methodName = getMethodNames(config);
    var definition = getDefinition(config.schema);
    var basePath = config.api ? toCamelCase(config.api) : '/' + toCamelCase(config.name);
    var swagger = {
        swagger: "2.0",
        info: {
            version: "1.0.0",
            title: config.name + " API"
        },
        host: "localhost:" + (config.port || 3000),
        basePath: basePath,
        schemes: ["http"],
        consumes: ["multipart/form-data", "application/json"],
        produces: ["application/json", "text/plain"],
        paths: {},
        definitions: {}
    };
    var name = toCamelCase(config.name);
    swagger.definitions[`${name}_create`] = definition;
    swagger.paths["/v1/" + name] = {
        "x-swagger-router-controller": `${methodName.controller}`,
        "get": {
            description: `Retrieve a list of ${name}`,
            operationId: `${methodName.list}`,
            parameters: getParameters,
            responses: {
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters" },
                "404": { description: "No categories to list with the given parameter set." },
                "500": { description: "Internal server error" }
            }
        },
        "post": {
            description: `Create a new ${name}`,
            operationId: `${methodName.create}`,
            parameters: [
                {
                    name: "data",
                    in: "body",
                    description: `Payload to create a ${name}`,
                    schema: {
                        $ref: `#/definitions/${name}_create`
                    }
                }
            ],
            responses: {
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters" },
                "404": { description: "No categories to list with the given parameter set." },
                "500": { description: "Internal server error" }
            }
        }
    };
    swagger.paths["/v1/" + name + "/{id}"] = {
        "x-swagger-router-controller": `${methodName.controller}`,
        "get": {
            description: `Retrieve a list of ${name}`,
            operationId: `${methodName.retrive}`,
            parameters: showParameters,
            responses: {
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters" },
                "404": { description: "No categories to list with the given parameter set." },
                "500": { description: "Internal server error" }
            }
        },
        "put": {
            description: `Create a new ${name}`,
            operationId: `${methodName.update}`,
            parameters: [
                {
                    name: "data",
                    in: "body",
                    description: `Payload to update a ${name}`,
                    schema: {
                        $ref: `#/definitions/${name}_create`
                    }
                }, {
                    name: "id",
                    in: "path",
                    type: "string",
                    required: true,
                    description: `Id of the ${name} to be updated`,
                }
            ],
            responses: {
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters" },
                "404": { description: "No categories to list with the given parameter set." },
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
                    description: `Id of the ${name} to be updated`,
                }
            ],
            responses: {
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters" },
                "404": { description: "No categories to list with the given parameter set." },
                "500": { description: "Internal server error" }
            }
        }
    };
    return swagger;
}

module.exports.generateYaml = generateYaml;