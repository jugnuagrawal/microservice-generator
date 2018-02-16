const path = require('path');
const fs = require('fs');
const package = require('./templates/package.template');
const app = require('./templates/app.template');
const controller = require('./templates/controller.template');


String.prototype.toCamelCase = function () {
    return this
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
}

function createProject(_data) {
    var _name = _data.name.toCamelCase();
    var _api = _data.api ? _data.api : _name;
    var _path = path.join('../', _name);
    var _database = _data.database ? _data.database : _name;
    var _port = _data.port ? _data.port : 3000;
    if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
    }
    if (!fs.existsSync(path.join(_path, 'controllers'))) {
        fs.mkdirSync(path.join(_path, 'controllers'));
    }
    if (!fs.existsSync(path.join(_path, 'schemas'))) {
        fs.mkdirSync(path.join(_path, 'schemas'));
    }
    if (!fs.existsSync(path.join(_path, 'messages'))) {
        fs.mkdirSync(path.join(_path, 'messages'));
    }
    if (!fs.existsSync(path.join(_path, 'utils'))) {
        fs.mkdirSync(path.join(_path, 'utils'));
    }

    fs.writeFileSync(path.join(_path, 'controllers', _name + '.controller.js'), controller.getContent(_name, _data.id), 'utf-8')
    console.log(_name + '.controller.js created!');
    fs.writeFileSync(path.join(_path, 'schemas', _name + '.schema.json'), JSON.stringify(_data.schema), 'utf-8')
    console.log(_name + '.schema.json created!');
    fs.copyFileSync(path.join(__dirname, 'templates/messages.template.json'), path.join(_path, 'messages', _name + '.messages.json'));
    console.log(_name + '.messages.json created!');

    //required once execution
    fs.copyFileSync(path.join(__dirname, 'templates/utils.template.js'), path.join(_path, 'utils', 'utils.js'))
    console.log('utils.js created!');
    fs.writeFileSync(path.join(_path, 'app.js'), app.getContent(_name, path.join('/', _api), _database, _port), 'utf-8')
    console.log('app.js created!');
    fs.writeFileSync(path.join(_path, 'package.json'), package.getContent(_name), 'utf-8')
    console.log('package.json created!');
}


module.exports.createProject = createProject;