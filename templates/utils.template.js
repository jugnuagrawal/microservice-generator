var mongoose = require("mongoose");
var _ = require('lodash');
var counterSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    next: {
        type: Number
    }
});
var counterModel = mongoose.model("counter", counterSchema);
function _creatCounter(collectionName) {
    counterModel.create({
        _id: collectionName,
        next: 1
    }).then(() => {}, () => {});
};

function _getNext(collectionName, callback) {
    var options = {};
    options.new = true;
    options.upsert = true;
    options.setDefaultsOnInsert = true;
    counterModel.findByIdAndUpdate(collectionName, {
        $inc: {
            next: 1
        }
    }, options, callback);
};


function _getNextId(collectionName) {
    _creatCounter(collectionName)
    return function (next) {
        var self = this;
        if (!self._id) {
            _getNext(collectionName,function(_err,_doc){
                self._id = collectionName.charAt(0).toUpperCase()+_.padStart(_doc.next,8,'0');
            });
        } else {
            next();
        }
    };
}


module.exports.getNextId = _getNextId;