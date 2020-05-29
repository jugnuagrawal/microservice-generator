const _ = require('lodash');

/**
 * 
 * @param {object} filter 
 */
function parseFilter(filter) {
    return filter;
}


/**
 * 
 * @param {string} collectionName 
 */
async function getNextID(collectionName) {
    const collection = global.db.collection('counter');
    const data = await collection.findOneAndUpdate({ _id: collectionName }, { $inc: { next: 1 } }, { upsert: true });
    return _.upperCase(collectionName.substr(0, 3)) + _.padStart(data.value.next, 6, '0');
}


module.exports.parseFilter = parseFilter;
module.exports.getNextID = getNextID;