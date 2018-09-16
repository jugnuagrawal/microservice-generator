const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const package = require('./templates/package.template');
const app = require('./templates/app.template');
const controller = require('./templates/controller.template');
const indexController = require('./templates/index.controller');
const swagger = require('./templates/yaml.template');


String.prototype.toCamelCase = function () {
    return this.split(' ').map((e, i) => i === 0 ? e : (e[0].toUpperCase() + e.substr(1, e.length))).join('');
}

String.prototype.toPascalCase = function () {
    return this.split(' ').map(e => e[0].toUpperCase() + e.substr(1, e.length)).join('');
}

function createProject(_data) {
    var _name = _data.name.toCamelCase();
    var _api = _data.api ? _data.api : _name;
    var _path = path.join(_name);
    if (_data.filePath) {
        var segments = _data.filePath.split('/');
        segments.pop();
        segments.push(_name);
        _path = segments.join('/');
    }
    var _database = _data.database ? _data.database : _name;
    var _port = _data.port ? _data.port : 3000;
    if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
    }
    if (!fs.existsSync(path.join(_path, 'api'))) {
        fs.mkdirSync(path.join(_path, 'api'));
    }
    if (!fs.existsSync(path.join(_path, 'api', 'controllers'))) {
        fs.mkdirSync(path.join(_path, 'api', 'controllers'));
    }
    if (!fs.existsSync(path.join(_path, 'api', 'schemas'))) {
        fs.mkdirSync(path.join(_path, 'api', 'schemas'));
    }
    if (!fs.existsSync(path.join(_path, 'api', 'messages'))) {
        fs.mkdirSync(path.join(_path, 'api', 'messages'));
    }
    // if (!fs.existsSync(path.join(_path, 'api', 'utils'))) {
    //     fs.mkdirSync(path.join(_path, 'api', 'utils'));
    // }
    if (!fs.existsSync(path.join(_path, 'apidoc'))) {
        fs.mkdirSync(path.join(_path, 'apidoc'));
    }
    if (!fs.existsSync(path.join(_path, 'api', 'swagger'))) {
        fs.mkdirSync(path.join(_path, 'api', 'swagger'));
    }

    fse.copySync(path.join(__dirname, 'apidoc'), path.join(__dirname, _path, 'apidoc'));

    fs.writeFileSync(path.join(_path, 'api', 'controllers', _name + '.controller.js'), controller.getContent(_name, _data.id), 'utf-8')
    console.log(_name + '.controller.js created!');
    fs.writeFileSync(path.join(_path, 'api', 'controllers', 'index.js'), indexController.getContent(_name), 'utf-8')
    console.log('index.js created!');
    fs.writeFileSync(path.join(_path, 'api', 'schemas', _name + '.schema.json'), JSON.stringify(_data.schema), 'utf-8')
    console.log(_name + '.schema.json created!');
    fs.copyFileSync(path.join(__dirname, 'templates/messages.template.json'), path.join(_path, 'api', 'messages', _name + '.messages.json'));
    console.log(_name + '.messages.json created!');
    fs.writeFileSync(path.join(_path, 'api', 'swagger', _name + '.swagger.yaml'), swagger.getContent(_data), 'utf-8')
    console.log(_name + '.swagger.yaml created!');

    //required once execution
    // fs.copyFileSync(path.join(__dirname, 'templates/utils.template.js'), path.join(_path, 'api', 'utils', 'utils.js'))
    // console.log('utils.js created!');
    fs.writeFileSync(path.join(_path, 'app.js'), app.getContent(_name, path.join('/', _api), _database, _port), 'utf-8')
    console.log('app.js created!');
    fs.writeFileSync(path.join(_path, 'package.json'), package.getContent(_name), 'utf-8')
    console.log('package.json created!');
}


module.exports.createProject = createProject;