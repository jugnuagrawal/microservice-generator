#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const generator = require('./index');

program
    .version('1.0.0')
    .usage('[options] <name>')
    .arguments('<name>')
    .option('-d, --dir', 'Directory name')
    .action(function (name, options) {
        let location = path.join(process.cwd(), name);
        if (options.dir) {
            const files = fs.readdirSync(location, 'utf8');
            files.forEach(file => {
                getSchema(path.join(location, file));
            });
        } else {
            getSchema(location);
        }
    }).parse(process.argv);


function getSchema(filePath) {
    try {
        fs.statSync(filePath);
        let data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);
        // json.filePath = filePath;
        generator.createProject(json);
    } catch (e) {
        console.log(chalk.red(e.message));
    }
}