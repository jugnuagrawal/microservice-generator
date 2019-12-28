const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_nameCamelCase, _nameKebabCase) {
    return `
const mongoose = require('mongoose');
const log4js = require('log4js');
const schemaJSON = require('../schemas/${_nameKebabCase}.schema');
const messages = require('../messages/${_nameKebabCase}.messages');

const schema = new mongoose.Schema(schemaJSON);
const logger = log4js.getLogger('${_nameKebabCase}.controller');

const model = mongoose.model('${_nameCamelCase}', schema, '${_nameCamelCase}');

function retrive(req, res) {
    async function execute() {
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
        } else if (req.query.countOnly) {
            query = model.countDocuments(filter);
        } else {
            query = model.find(filter);
            query.skip(skip);
            query.limit(count);
        }
        if (!req.query.countOnly) {
            if (req.query.select) {
                query.select(req.query.select.split(',').join(' '));
            }
            if (req.query.sort) {
                query.sort(req.query.sort.split(',').join(' '))
            }
        }
        const data = query.exec();
        if (req.swagger.params.id && req.swagger.params.id.value && !data) {
            res.status(404).json({ message: messages.get['404'] });
        } else {
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
}

function create(req, res) {
    async function execute() {
        const data = await model.create(req.body);
        res.status(200).json(data);
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
}

function update(req, res) {
    async function execute() {
        if (!req.swagger.params.id) {
            res.status(400).json({ message: messages.put['400'] });
            return;
        }
        const doc = model.findById(req.swagger.params.id.value)
        if (!doc) {
            res.status(404).json({ message: messages.put['404'] });
        } else {
            doc.set(req.body);
            const data = doc.save();
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
}

function destroy(req, res) {
    async function execute() {
        if (!req.swagger.params.id) {
            res.status(400).json({ message: messages.delete['400'] });
            return;
        }
        const doc = model.findById(req.swagger.params.id.value)
        if (!doc) {
            res.status(404).json({ message: messages.delete['404'] });
        } else {
            const data = doc.remove();
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: messages.post['500'] });
    });
}

module.exports.create = create;
module.exports.retrive = retrive;
module.exports.update = update;
module.exports.destroy = destroy;`
}
