const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
let swaggerConfig = require('./config/swagger.config');

exports = module.exports = function (options) {
    console.log(options.staticFilesDirectory);
    const staticFilesDirectory = options.staticFilesDirectory;
    const allJsList = [];
    if (staticFilesDirectory && typeof staticFilesDirectory == 'string') {
        if (!fs.existsSync(staticFilesDirectory)) {
            throw new Error('can\'t find the static files directory ', staticFilesDirectory);
        }
    } else {
        throw new Error('can\'t find the arugment -s, this argument is webapp static file directory!');
    }

    readAllDir(staticFilesDirectory);
    console.log(allJsList);

    let app = express();
    app.use(bodyParser.json()); // To support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // To support URL-encoded bodies
        extended: true,
    }));

    let swaggerOptions = {
        // Import swaggerDefinitions
        swaggerDefinition: swaggerConfig,
        // Path to the API docs
        apis: allJsList,
    };
    let swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.get('/', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.get('/api-docs.json', function (req, res) {
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

    function isDirectory(path) {
        let stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    function readAllDir(dir) {
        const dirs = fs.readdirSync(dir);

        for (let i = 0; i < dirs.length; i++) {

            var filePath = path.join(dir, dirs[i]);

            var stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readAllDir(filePath);
            } else {
                if (/js$/.test(filePath) || /vue$/.test(filePath) || /jsx$/.test(filePath)) {
                    if(isSwaggerDoc(filePath)){
                        allJsList.push(filePath);
                    }
                }
            }

        }
    }

    function isSwaggerDoc(file) {
        let fileContent = fs.readFileSync(file).toString();
        fileContent = fileContent.replace(/\s|\xA0/g, "");
        if (/@swagger/.test(fileContent)) {
            return true;
        } else {
            return false;
        }

    }
};