const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name, _api, _database, _port) {
    return `
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const mongoose = require('mongoose');
const SwaggerExpress = require('swagger-express-mw');
const jsyaml = require('js-yaml');
const messages = require('./api/messages/${_name}.messages');
const logger = log4js.getLogger('Server');
const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || ${_port};
const mongo_url = process.env.MONGO_URL || 'mongodb://localhost:27017/${_database}';

//log4js configuration
log4js.configure({
    appenders: { 'out': { type: 'stdout' },server: { type: 'file', filename: 'logs/server.log' ,maxLogSize:52428800} },
    categories: { default: { appenders: ['out','server'], level: 'info' } }
    });

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//logging each request
app.use((req, res, next)=>{
    logger.info(req.method,req.headers['x-forwarded-for'] || req.connection.remoteAddress,req.path,req.params,req.query,req.body);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    next();
});

//checking mongodb is available
app.use((req, res, next)=>{
    if (mongoose.connections.length == 0 || mongoose.connections[0].readyState != 1) {
        mongoose.connect(mongo_url, (err) => {
            if (err) {
                logger.error(err);
                res.status(500).json({ message: messages.error['500'] });
            } else {
                next();
            }
        });
    }else{
        next();
    }
});

// Uncomment and right your own business logic to do Authentication check
/*app.use((req,res,next)=>{
    if(req.headers.authorization){
        next();
    }else{
        res.status(401).json({message:messages.error['401']});
    }
});*/

app.use(express.static(path.join(__dirname, 'apidoc')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'apidoc', 'index.html'));
});
app.get('/swagger', (req, res) => {
    const content = fs.readFileSync(path.join(__dirname, 'api', 'swagger', '${_name}.swagger.yaml'), 'utf8');
    res.json(jsyaml.safeLoad(content, 'utf8'));
});

mongoose.connect(mongo_url, (err) => {
    if (err) {
        logger.error(err);
        process.exit(0);
    }else{
        logger.info('Connected to db');
    }
});

SwaggerExpress.create({
    appRoot: __dirname,
    swaggerFile: path.join(__dirname, 'api', 'swagger', '${_name}.swagger.yaml')
}, (err, swaggerExpress) => {
    if (err) { throw err; }
    swaggerExpress.register(app);
    // Error handler
    app.use((err, req, res, next) => {
        if (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1) {
            if (err.statusCode == 404 || err.statusCode == 405) {
                res.status(404).json({ message: messages.error['404'] });
            } else {
                res.status(500).json(err);
            }
        } else {
            next();
        }
    });
    app.listen(port, (err) => {
        if (!err) {
            logger.info('Server started on port ' + port);
        }
        else
            logger.error(err);
    });
});
    `;

}