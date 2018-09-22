
function _getContent(_name) {
    return `
module.exports = {
    "get": {

    },
    "post": {

    },
    "put": {

    },
    "delete": {

    },
    "error": {
        "401": "You are not authorised to access the information.",
        "404": "It seems that you looking for something at the wrong place.",
        "500": "We have done somthing wrong, we are looking into it."
    }
};
`;
}


module.exports.getContent = _getContent;