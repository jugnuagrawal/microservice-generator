
function getContent(data) {
    return `
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT ${data.port}
ENV MONGO_URL mongodb://localhost:27017/${data.database}
ENV LOG_LEVEL info
EXPOSE \${PORT}
CMD [ "node", "app.js" ]
`;
}


module.exports.getContent = getContent;