function getContent(data) {
    return `
const express = require('express');
const log4js = require('log4js');
const MongoClient = require('mongodb').MongoClient;

const logger = log4js.getLogger('server');
const app = express();

const PORT = process.env.PORT || ${data.port};
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DATABASE = process.env.DATABASE || '${data.database}';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const JSON_LIMIT = process.env.JSON_LIMIT || '500kb';


log4js.configure({
    appenders: { 'out': { type: 'stdout' },server: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log', maxLogSize:52428800, backups: 3, compress: true } },
    categories: { default: { appenders: ['out','server'], level: LOG_LEVEL } }
});

MongoClient.connect(MONGO_URL).then(client => {
    const db = client.db(DATABASE);
    global.db = db;
    global.collection = db.collection('${data.nameCamelCase}');
    logger.info('Database Connected');
}).catch(err => {
    logger.error('Unable to connect to Database');
    logger.error(err);
    process.exit(0);
});

app.use(express.json({
    inflate: true,
    limit: JSON_LIMIT
}));

app.use((req, res, next) => {
    logger.info(req.method, req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.path);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Server is up and running'
    });
});

app.get('/${data.nameKebabCase}.json', (req, res) => {
    res.json(require('schema.json'));
});

app.use('/api/${data.api}', require('./controller.js'));

app.listen(PORT, (err) => {
    if (err) {
        logger.error(err);
    } else {
        logger.info('Server started on port', PORT);
    }
});
`;
}


module.exports.getContent = getContent;