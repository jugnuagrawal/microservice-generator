const readline = require('readline');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const package = require('./templates/package.template');
const app = require('./templates/app.template');
const controller = require('./templates/controller.template');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your schema file name (schema.json): ', (_answer) => {
    if (_answer) {
        if (_answer.lastIndexOf('.json') == -1 || _answer.lastIndexOf('.json') != _answer.length - 5) {
            _answer += ".json";
        }
        getSchema(_answer);
    } else {
        getSchema('schema.json');
    }
    rl.close();
});

function getSchema(_fileName) {
    if (fs.existsSync(_fileName)) {
        fs.readFile(_fileName, 'utf8', (_err, _data) => {
            if (_err) throw _err;
            createProject(JSON.parse(_data));
        });
    } else {
        console.log(_fileName, ' does not exist in this folder.');
    }
}

function createProject(_data) {
    var _name = _.camelCase(_.lowerCase(_data.name));
    var _api = _data.api ? _data.api : _name;
    var _path = path.join('../', _name);
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
    fs.copyFileSync('templates/messages.template.json', path.join(_path, 'messages', _name + '.messages.json'));
    console.log(_name + '.messages.json created!');

    //required once execution
    fs.copyFileSync('templates/utils.template.js', path.join(_path,'utils','utils.js'))
    console.log('utils.js created!');
    fs.writeFileSync(path.join(_path, 'app.js'), app.getContent(_name, path.join('/', _api)), 'utf-8')
    console.log('app.js created!');
    fs.writeFileSync(path.join(_path, 'package.json'), package.getContent(_name), 'utf-8')
    console.log('package.json created!');
}


module.exports.createProject = createProject;