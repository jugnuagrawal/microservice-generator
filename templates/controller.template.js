const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_name) {
    return `
const mongoose = require('mongoose');
const log4js = require('log4js');
const schemaJSON = require('../schemas/userDetails.schema');
const messages = require('../messages/userDetails.messages');
const schema = new mongoose.Schema(schemaJSON);
const logger = log4js.getLogger('Controller');

const model = mongoose.model('userDetails', schema);

log4js.configure({
    appenders: { 'out': { type: 'stdout' }, controller: { type: 'file', filename: 'logs/controller.log', maxLogSize: 52428800 } },
    categories: { default: { appenders: ['out', 'controller'], level: 'info' } }
});

function _create(req, res) {
    model.create(req.body).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
}

function _retrive(req, res) {
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
            filter = JSON.parse(req.query.filter, (key, value) => {
                if (typeof value == 'string' && value.match(/^(\/)*[\w]+(\/)*[a-z]{0,1}/)) {
                    if (value.charAt(value.length - 1) != '/') {
                        return new RegExp(value.replace(/^\/*([\w]+)\/*[a-z]*$/, '$1'), value.replace(/^.*\/([a-z]+)$/, '$1'));
                    } else {
                        return new RegExp(value.replace(/^\/*([\w]+)\/*[a-z]*$/, '$1'));
                    }
                }
                return value;
            });
        } catch (err) {
            logger.error(err);
        }
    }
    if (req.params.id) {
        query = model.findById(req.params.id);
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
        res.status(200).json(data);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.get['500'] });
    });
}

function _update(req, res) {
    model.findById(req.params.id).then(doc => {
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
}

function _delete(req, res) {
    model.findById(req.params.id).then(doc => {
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
}

function _count(req, res) {
    if (req.query.filter) {
        model.where(req.query.filter);
    }
    model.countDocuments().then(count => {
        res.status(200).json(count);
    }).catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.error['500'] });
    });
}


//Exporting CRUD controllers
module.exports = {
    create: _create,
    retrive: _retrive,
    update: _update,
    delete: _delete,
    count: _count
}
    
    `;
}
