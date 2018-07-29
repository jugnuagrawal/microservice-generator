#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const generator = require('./index');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask() {
    rl.question('Enter the path of your schema file [default: sampleSchema.json] : ', (_fileName) => {
        if(!_fileName.trim()){
            console.log('No file name entered, using sampleSchema.json');
            rl.close();
            getSchema('sampleSchema.json');            
        }else if (_fileName.match(/^[\w\s\\\/]+\.json$/)) {
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
            generator.createProject(JSON.parse(_data));
        });
    } else {
        console.log(_fileName, ' does not exist.');
    }
}