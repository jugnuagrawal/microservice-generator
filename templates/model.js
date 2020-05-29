const utils = require('./utils');

async function find(options) {
    const collection = global.collection;
    if (!options) {
        options = {};
    }
    if (!options.filter) {
        options.filter = {};
    }
    options.filter = utils.parseFilter(options.filter);
    if (!options.count) {
        options.count = 30;
    }
    if (!options.page && options.count != -1) {
        options.page = 1;
    }
    let cursor = collection.find(options.filter);
    if (options.select) {
        cursor.project(getObject(options.select));
    }
    if (options.sort) {
        cursor.sort(getObject(options.sort));
    }
    if (options.count != -1) {
        cursor.skip((options.page - 1) * options.count);
        cursor.limit(options.count);
    }
    return cursor.toArray();
}


async function findById(id, select) {
    const collection = global.collection;
    let promise;
    if (select) {
        promise = collection.findOne({ _id: id }, {
            projection: getObject(select)
        });
    } else {
        promise = collection.findOne({ _id: id });
    }
    return promise;
}


async function countDocuments(filter) {
    const collection = global.collection;
    if (!filter) {
        filter = {};
    }
    return collection.countDocuments(filter);
}

async function update(id, data) {
    const collection = global.collection;
    return collection.updateOne({ _id: id }, { $set: data });
}

async function updateMany(filter, data) {
    const collection = global.collection;
    if (!filter) {
        filter = {};
    }
    return collection.updateMany(filter, { $set: data });
}

async function remove(id) {
    const collection = global.collection;
    return collection.deleteOne({ _id: id });
}

async function removeMany(filter) {
    const collection = global.collection;
    if (!filter) {
        filter = {};
    }
    return collection.deleteMany(filter);
}

async function create(data) {
    const collection = global.collection;
    data._id = await utils.getNextID(global.collectionName);
    return collection.insertOne(data);
}

async function createMany(data) {
    const collection = global.collection;
    const flag = await data.reduce((prev, curr) => {
        return prev.then(async () => {
            curr._id = await utils.getNextID(global.collectionName);
            return;
        });
    }, Promise.resolve());
    return collection.insertMany(data);
}


function getObject(string) {
    let fields = string;
    if (typeof string === 'string') {
        fields = string.split(',');
    }
    return fields.map(e => {
        if (e.startsWith('-')) {
            const key = e.substr(1, e.length - 1);
            return { [key]: 1 };
        } else {
            return { [e]: 1 };
        }
    });
}



module.exports.find = find;
module.exports.findById = findById;
module.exports.countDocuments = countDocuments;
module.exports.update = update;
module.exports.updateMany = updateMany;
module.exports.remove = remove;
module.exports.removeMany = removeMany;
module.exports.create = create;
module.exports.createMany = createMany;