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
        res.status(400).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    });       
});
log.info(`Users POST endpoint ${props.endpoints.users} registered`);

app.get(props.endpoints.users, (req, res) => {
    log.info(`GET request received to ${props.endpoints.users} endpoint`);
    User.find({}).then((users) => {
        log.info('Users correctly fetched');
        res.json(users);
    }).catch((error) => {
        log.error(`Something went wrong. Review the fetch: ${error}`)
        res.status(500).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    });
});
log.info(`Users GET endpoint ${props.endpoints.users} registered`);

app.get(props.endpoints.user, (req, res) => {
    log.info(`GET request received to ${props.endpoints.user} endpoint with params ${JSON.stringify(req.params)}`);
    const idToFetch = req.params.id;
    if(idToFetch) {
        User.findById(idToFetch).then((user) => {
            log.info(`User correctly fetched: ${JSON.stringify(user)}`);
            res.json(user);
        }).catch((error) => {
            log.error(`Something went wrong. Review the fetch: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        });
    } else {
        res.status(400).json({
            message: 'Missing required id route param'
        });
    }
});
log.info(`User GET endpoint ${props.endpoints.user} registered`);

app.get(props.endpoints.task, (req, res) => {
    log.info(`GET request received to ${props.endpoints.task} endpoint with params ${JSON.stringify(req.params)}`);
    const idToFetch = req.params.id;
    if(idToFetch) {
        Task.findById(idToFetch).then((task) => {
            log.info(`Task correctly fetched: ${JSON.stringify(task)}`);
            res.json(task);
        }).catch((error) => {
            log.error(`Something went wrong. Review the fetch: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        });
    } else {
        res.status(400).json({
            message: 'Missing required id route param'
        });
    }
});
log.info(`Task GET endpoint ${props.endpoints.task} registered`);

app.post(props.endpoints.tasks, (req, res) => {
    log.info(`POST request received to ${props.endpoints.tasks} endpoint`);
    const taskToSave = new Task(req.body);
    log.info(`Task to save: ${JSON.stringify(taskToSave)}`);
    taskToSave.save().then(() => {
        log.info(`Task correctly saved: ${JSON.stringify(taskToSave)}`);
        res.json(taskToSave);
    }).catch((error) => {
        log.error(`Something went wrong. Review the saving: ${error}`)
        res.status(400).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    });       
});
log.info(`Tasks POST endpoint ${props.endpoints.tasks} registered`);

app.get(props.endpoints.tasks, (req, res) => {
    log.info(`GET request received to ${props.endpoints.tasks} endpoint`);
    Task.find({}).then((tasks) => {
        log.info('Tasks correctly fetched');
        res.json(tasks);
    }).catch((error) => {
        log.error(`Something went wrong. Review the fetch: ${error}`)
        res.status(500).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    });
});
log.info(`Tasks GET endpoint ${props.endpoints.tasks} registered`);

const defaultPort = process.env.PORT || props.server.defaultPort;
app.listen(defaultPort, () => {
    log.info(`Server up & runnig in port ${defaultPort}`);
});