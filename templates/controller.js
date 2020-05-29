const router = require('express').Router();
const log4js = require('log4js');
const AJV = require('ajv');
const _ = require('lodash');

const jsonSchema = require('./schema.json');
const model = require('./model');

const logger = log4js.getLogger('controller');
const validate = (new AJV()).compile(jsonSchema);


router.get('/', function (req, res) {
    async function execute() {
        let data;
        if (req.query.countOnly) {
            data = await model.countDocuments(req.query.filter);
        } else {
            data = await model.find(req.query);
        }
        res.status(200).json(data);
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.get('/:id', function (req, res) {
    async function execute() {
        if (!req.params.id) {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        const data = await model.findById(req.params.id, req.query.select);
        if (!data) {
            res.status(404).json({
                message: 'Document Not Found'
            });
        } else {
            res.status(200).json(data);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.post('/', function (req, res) {
    async function execute() {
        const payload = req.body;
        if (!validate(payload)) {
            return res.status(400).json(validate.errors);
        }
        const data = await model.create(payload);
        res.status(200).json(data);
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.put('/:id', function (req, res) {
    async function execute() {
        if (!req.params.id) {
            res.status(400).json({ message: 'Invalid ID' });
            return;
        }
        const doc = await model.findById(req.params.id)
        if (!doc) {
            res.status(404).json({ message: 'Document Not Found' });
        } else {
            const payload = _.merge(JSON.parse(JSON.stringify(doc)), req.body);
            if (_.isEqual(payload, doc)) {
                return res.status(200).json(payload);
            }
            if (!validate(payload)) {
                return res.status(400).json(validate.errors);
            }
            const data = await model.update(req.params.id, payload);
            res.status(200).json(payload);
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

router.delete('/:id', function (req, res) {
    async function execute() {
        if (!req.params.id) {
            res.status(400).json({ message: 'Invalid ID' });
            return;
        }
        const doc = await model.findById(req.params.id)
        if (!doc) {
            res.status(404).json({ message: 'Document Not Found' });
        } else {
            const data = model.remove(req.params.id);
            res.status(200).json({ message: 'Document Removed' });
        }
    }
    execute().catch(err => {
        logger.error(err);
        res.status(500).json({ message: err.message });
    });
});

module.exports = router;