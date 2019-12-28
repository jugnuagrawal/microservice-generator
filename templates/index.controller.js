
function _getContent(_nameCamelCase, _nameKebabCase) {
    return `
const ${_nameCamelCase}Controller = require('./${_nameKebabCase}.controller.js');
module.exports = {
    ${_nameCamelCase}Create:${_nameCamelCase}Controller.create,
    ${_nameCamelCase}Retrive:${_nameCamelCase}Controller.retrive,
    ${_nameCamelCase}RetriveAll:${_nameCamelCase}Controller.retrive,
    ${_nameCamelCase}Update:${_nameCamelCase}Controller.update,
    ${_nameCamelCase}Delete:${_nameCamelCase}Controller.destroy
};
`;
}


module.exports.getContent = _getContent;