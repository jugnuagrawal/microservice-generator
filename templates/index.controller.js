
function _getContent(_name) {
    return `
    const ${_name}Controller = require('./${_name}.controller.js');
    module.exports = {
        ${_name}Create:${_name}Controller.create,
        ${_name}Retrive:${_name}Controller.retrive,
        ${_name}RetriveAll:${_name}Controller.retrive,
        ${_name}Update:${_name}Controller.update,
        ${_name}Delete:${_name}Controller.delete,
        ${_name}Count:${_name}Controller.count
    };`;
}


module.exports.getContent = _getContent;