const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const package = require('./templates/package.template');
const app = require('./templates/app.template');
const docker = require('./templates/docker.template');
const readme = require('./templates/readme.template');

String.prototype.toCamelCase = function () {
    return this.split(' ').map((e, i) => i === 0 ? e.toLowerCase() : (e[0].toUpperCase() + e.substr(1, e.length))).join('');
}

String.prototype.toPascalCase = function () {
    return this.split(' ').map(e => e[0].toUpperCase() + e.substr(1, e.length)).join('');
}

String.prototype.toKebabCase = function () {
    return this.split(' ').map(e => e.toLowerCase()).join('-');
}

function createProject(data) {
    data.nameCamelCase = data.name.toCamelCase();
    data.nameKebabCase = data.name.toKebabCase();
    if (!data.api) {
        data.api = data.nameCamelCase;
    }
    if (!data.database) {
        data.database = data.nameCamelCase;
    }
    if (!data.port) {
        data.port = 3000;
    }
    const folderPath = path.join(process.cwd(), data.nameKebabCase);
    console.log(chalk.green('**********************'));
    console.log(chalk.green('Process Started'));
    console.log(chalk.green('**********************'));
    mkdirp.sync(folderPath);
    console.log(chalk.cyan('\nFolder Created :: ' + data.nameKebabCase));
    fs.writeFileSync(path.join(folderPath, 'package.json'), package.getContent(data), 'utf-8')
    console.log(chalk.cyan('\npackage.json created!'));
    fs.writeFileSync(path.join(folderPath, 'app.js'), app.getContent(data), 'utf-8')
    console.log(chalk.cyan('\napp.js created!'));
    fs.copyFileSync(path.join(__dirname, 'templates/controller.js'), path.join(folderPath, 'controller.js'));
    console.log(chalk.cyan('\ncontroller.js created!'));
    fs.copyFileSync(path.join(__dirname, 'templates/model.js'), path.join(folderPath, 'model.js'));
    console.log(chalk.cyan('\nmodel.js created!'));
    fs.copyFileSync(path.join(__dirname, 'templates/utils.js'), path.join(folderPath, 'utils.js'));
    console.log(chalk.cyan('\nutils.js created!'));
    fs.writeFileSync(path.join(folderPath, 'schema.json'), JSON.stringify(data.schema, null, 4), 'utf-8');
    console.log(chalk.cyan('\nschema.json created!'));
    fs.writeFileSync(path.join(folderPath, '.gitignore'), 'node_modules\nlogs\n.vscode\n', 'utf-8');
    console.log(chalk.cyan('\n.gitignore created!'));
    fs.writeFileSync(path.join(folderPath, '.dockerignore'), 'node_modules\nlogs\n.vscode', 'utf-8');
    console.log(chalk.cyan('\n.dockerignore created!'));
    fs.writeFileSync(path.join(folderPath, 'Dockerfile'), docker.getContent(data), 'utf-8');
    console.log(chalk.cyan('\nDockerfile created!'));
    fs.writeFileSync(path.join(folderPath, 'README.md'), readme.getContent(data), 'utf-8');
    console.log(chalk.cyan('\nREADME.md created!\n'));
    console.log(chalk.green('**********************'));
    console.log(chalk.green('Process Ended'));
    console.log(chalk.green('**********************'));
}


module.exports.createProject = createProject;