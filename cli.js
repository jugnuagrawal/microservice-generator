#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const generator = require('./index');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask() {
    rl.question('Location of your schema file [sampleSchema.json] : ', (_fileName) => {
        if (!_fileName.trim()) {
            console.log('No file name entered, using sampleSchema.json');
            rl.close();
            getSchema('sampleSchema.json');
        } else if (_fileName.match(/^.*\.json$/i)) {
            getSchema(_fileName);
            rl.close();
        } else {
            console.log('Please enter a valid file name');
            ask();
        }
    });
}
ask();

rl.on('close', () => {
    console.log();
});

function getSchema(_fileName) {
    if (fs.existsSync(_fileName)) {
        fs.readFile(_fileName, 'utf8', (_err, _data) => {
            if (_err) throw _err;
            const json = JSON.parse(_data);
            json.filePath = _fileName;
            generator.createProject(json);
        });
    } else {
        console.log(_fileName, ' does not exist.');
    }
}