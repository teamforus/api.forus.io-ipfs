"use strict";

const express = require('express');
const app = express();
var api = require('./api')

const port = 80;

app.use('/api', api);

const server = app.listen(port, () => console.log('Listening on port ' + port));

process.on('SIGTERM', () =>  {
    console.log('Received SIGTERM; closing webserver');
	server.close();
});
