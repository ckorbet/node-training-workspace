const express = require('express');
const User = require('./models/User');
const Task = require('./models/Task');

const props = require('../resources/properties.json');
const log = require('./utils/winston');
log.info('Props. & winston logging set up');

/*
 * We dont really need to store this in any constant,
 * since we just need to instantiate mongodb connection
 */
require('./db/mongoose');

const app = express();
log.info('Express app server created');

app.use(express.json());
log.info('Express app server configured for json');

app.get(props.endpoints.health, (req, res) => {
    log.info(`GET request received to ${props.endpoints.health} endpoint`);
    res.json({
        status: 'UP'
    });
});
log.info(`Health check endpoint ${props.endpoints.health} registered`);

app.post(props.endpoints.users, (req, res) => {
    log.info(`POST request received to ${props.endpoints.users} endpoint`);
    const userToSave = new User(req.body);
    log.info(`User to save: ${JSON.stringify(userToSave)}`);
    userToSave.save().then(() => {
        log.info(`User correctly saved: ${JSON.stringify(userToSave)}`);
        res.json(userToSave);
    }).catch((error) => {
        log.error(`Something went wrong. Review the saving: ${error}`)
        res.status(400);
        res.json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    });       
});
log.info(`Users endpoint ${props.endpoints.users} registered`);

const defaultPort = process.env.PORT || props.server.defaultPort;
app.listen(defaultPort, () => {
    log.info(`Server up & runnig in port ${defaultPort}`);
});