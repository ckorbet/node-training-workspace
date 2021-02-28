const path = require('path');
const express = require('express');

const props = require('../resources/properties.json');
const log = require('./utils/winston');

const defaultPort = process.env.PORT || props.server.defaultPort;

const app = express();
log.info('Express app server created');

app.get(props.endpoints.health, (req, res) => {
    log.info(`GET request received to ${props.endpoints.health} endpoint`);
    res.json({
        status: 'UP'
    });
});
log.info(`Health check endpoint ${props.endpoints.health} registered`);

app.post(props.endpoints.users, (req, res) => {
    log.info(`POST request received to ${props.endpoints.users} endpoint`);
    res.json([]);
});
log.info(`Users endpoint ${props.endpoints.users} registered`);

app.listen(defaultPort, () => {
    log.info(`Server up & runnig in port ${defaultPort}`);
});