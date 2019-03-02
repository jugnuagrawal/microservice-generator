const path = require('path');

module.exports.getContent = _getContent;

function _getContent(_nameKebabCase) {
  return `
# ${_nameKebabCase}

## docker variables

| Variable | Usage |
| -------- | ----- |
| MONGO_URL | -e MONGO_URL=<<_your_mongo_url_>> |
| LOG_LEVEL | -e LOG_LEVEL=<<_your_log_level_>> |
| PORT | -e PORT=<<_your_port_>> |
| LOGS | -v <<_your_path_>>:/logs |
    `;
}