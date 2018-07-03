"use strict";

const express = require('express');
const app = express();
var api = require('./api')

const port = 80;

app.use('/api/v1', api);

app.use(function (error, req, res, next) {
    if (error) {
        res.status(500).json({
            result: false
        });
    } else {
        next();
    }
});

const server = app.listen(port, () => console.log('Listening on port ' + port));

process.on('SIGTERM', () =>  {
    console.log('Received SIGTERM; closing webserver');
	server.close();
});
