const _ = require('lodash');

IsString = (val) => val && val.constructor.name === 'String';
IsArray = (arg) => arg && arg.constructor.name === 'Array';
IsObject = (arg) => arg && arg.constructor.name === 'Object';
function CreateRegexp(str) {
    if (str.charAt(0) === '/' && str.charAt(str.length - 1) === '/') {
        var text = str.substr(1, str.length - 2).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        return new RegExp(text, 'i');
    } else {
        return str;
    }
}
function ResolveArray(arr) {
    for (var x = 0; x < arr.length; x++) {
        if (IsObject(arr[x])) {
            arr[x] = FilterParse(arr[x]);
        } else if (IsArray(arr[x])) {
            arr[x] = ResolveArray(arr[x]);
        } else if (IsString(arr[x])) {
            arr[x] = CreateRegexp(arr[x]);
        }
    }
    return arr;
}
function FilterParse(filterParsed) {
    for (var key in filterParsed) {
        if (IsString(filterParsed[key])) {
            filterParsed[key] = CreateRegexp(filterParsed[key])
        } else if (IsArray(filterParsed[key])) {
            filterParsed[key] = ResolveArray(filterParsed[key])
        } else if (IsObject(filterParsed[key])) {
            filterParsed[key] = FilterParse(filterParsed[key])
        }
    }
    return filterParsed
}

/**
 * 
 * @param {object} filter 
 */
function parseFilter(filter) {
    let tempFilter = filter;
    try {
        if (typeof filter === 'string') {
            tempFilter = JSON.parse(filter);
        }
        tempFilter = FilterParse(tempFilter);
    } catch (e) {
        tempFilter = FilterParse(tempFilter);
    } finally {
        return tempFilter;
    }
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