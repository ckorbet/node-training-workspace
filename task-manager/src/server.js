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
    res.json({ status: 'UP' });
});
log.info(`Health check endpoint ${props.endpoints.health} registered`);

app.use(require('./routers/user'));
log.info('User router registered');

app.use(require('./routers/task'));
log.info('Task router registered');

const defaultPort = process.env.PORT || props.server.defaultPort;
app.listen(defaultPort, () => {
    log.info(`Server up & runnig in port ${defaultPort}`);
});