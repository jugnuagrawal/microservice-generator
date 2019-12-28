
function _getContent(_port, _database) {
    return `
FROM node:10-alpine
WORKDIR /app
COPY . .
ENV PORT ${_port}
ENV MONGO_URL mongodb://localhost:27017/${_database}
ENV LOG_LEVEL info
RUN npm install
CMD [ "node", "app.js" ]
EXPOSE \${PORT}
`;
}


module.exports.getContent = _getContent;