const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_nameCamelCase, _nameKebabCase) {
    return `
const mongoose = require('mongoose');
const log4js = require('log4js');
const schemaJSON = require('../schemas/${_nameKebabCase}.schema');
const messages = require('../messages/${_nameKebabCase}.messages');
const schema = new mongoose.Schema(schemaJSON);
const logger = log4js.getLogger('Controller');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const model = mongoose.model('${_nameCamelCase}', schema, '${_nameCamelCase}');

log4js.configure({
    appenders: { 'out': { type: 'stdout' }, controller: { type: 'file', filename: 'logs/controller.log', maxLogSize: 52428800 } },
    categories: { default: { appenders: ['out', 'controller'], level: LOG_LEVEL } }
});

//Exporting CRUD controllers
const e = {
    create: (req, res) => {
        model.create(req.body).then(data => {
            res.status(200).json(data);
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: messages.post['500'] });
        });
    },
    retrive: (req, res) => {
        var query = null;
        var skip = 0;
        var count = 10;
        var filter = {};
        if (req.query.count && (+req.query.count) > 0) {
            count = +req.query.count;
        }
        if (req.query.page && (+req.query.page) > 0) {
            skip = count * ((+req.query.page) - 1);
        }
        if (req.query.filter) {
            try {
                filter = JSON.parse(req.query.filter);
            } catch (err) {
                filter = {};
                logger.error(err);
            }
        }
        if (req.swagger.params.id && req.swagger.params.id.value) {
            query = model.findById(req.swagger.params.id.value);
        } else {
            query = model.find(filter);
            query.skip(skip);
            query.limit(count);
        }
        if (req.query.select) {
            query.select(req.query.select.split(',').join(' '));
        }
        if (req.query.sort) {
            query.sort(req.query.sort.split(',').join(' '))
        }
        query.exec().then(data => {
            if (req.swagger.params.id && req.swagger.params.id.value && !data) {
                res.status(404).json({ message: messages.get['404'] });
            } else {
                res.status(200).json(data);
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: messages.get['500'] });
        });
    },
    update: (req, res) => {
        if (!req.swagger.params.id) {
            res.status(400).json({ message: messages.put['400'] });
            return;
        }
        model.findById(req.swagger.params.id.value).then(doc => {
            if (!doc) {
                res.status(404).json({ message: messages.put['404'] });
            } else {
                doc.set(req.body);
                doc.save().then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    logger.error(err);
                    res.status(500).json({ message: messages.put['500'] });
                });
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: messages.put['500'] });
        });
    },
    delete: (req, res) => {
        if (!req.swagger.params.id) {
            res.status(400).json({ message: messages.delete['400'] });
            return;
        }
        model.findById(req.swagger.params.id.value).then(doc => {
            if (!doc) {
                res.status(404).json({ message: messages.delete['404'] });
            } else {
                doc.remove().then(data => {
                    res.status(200).json(data);
                }).catch(err => {
                    logger.error(err);
                    res.status(500).json({ message: messages.delete['500'] });
                });
            }
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: messages.delete['500'] });
        });
    },
    count: (req, res) => {
        var filter = {};
        if (req.query.filter) {
            try {
                filter = JSON.parse(req.query.filter);
            } catch (err) {
                filter = {};
                logger.error(err);
            }
        }
        const query = model.countDocuments();
        query.where(filter);
        query.exec().then(count => {
            res.status(200).json(count);
        }).catch(err => {
            logger.error(err);
            res.status(500).json({ message: messages.error['500'] });
        });
    }
};


module.exports = e;
    `;
}
