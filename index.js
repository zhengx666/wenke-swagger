const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');

let app = express();
app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // To support URL-encoded bodies
    extended: true,
}));

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
let swaggerDefinition = {
    info: { // API informations (required)
        title: 'DT', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'DT api', // Description (optional)
    },
    host: 'localhost:7788', // Host (optional)
    basePath: '/', // Base path (optional)
};

// Options for the swagger docs
let options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['/Users/zhengx/code/wenwen/branch/sf/9.0Beta23Build010/src/js/baike/wap/comment/component/comment_list.vue'],
};
let swaggerSpec = swaggerJSDoc(options);
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.get('/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
// Expose app
exports = module.exports = app;

var server = app.listen(7788, function startExpressServer() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('swagger app listening at http://%s:%s', host, port);
});