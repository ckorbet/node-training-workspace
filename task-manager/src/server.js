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

app.post(props.endpoints.users, async (req, res) => {
    log.info(`POST request received to ${props.endpoints.users} endpoint`);
    const userToSave = new User(req.body);
    log.info(`User to save: ${JSON.stringify(userToSave)}`);
    try {
        await userToSave.save();
        log.info(`User correctly saved: ${JSON.stringify(userToSave)}`);
        res.json(userToSave);
    } catch(error) {
        log.error(`Something went wrong. Review the saving: ${error}`)
        res.status(400).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    }    
    // userToSave.save().then(() => {
    //     log.info(`User correctly saved: ${JSON.stringify(userToSave)}`);
    //     res.json(userToSave);
    // }).catch((error) => {
    //     log.error(`Something went wrong. Review the saving: ${error}`)
    //     res.status(400).json({
    //         _message: error._message,
    //         name: error.name,
    //         message: error.message
    //     });
    // });       
});
log.info(`Users POST endpoint ${props.endpoints.users} registered`);

app.get(props.endpoints.users, async (req, res) => {
    log.info(`GET request received to ${props.endpoints.users} endpoint`);
    try {
        const users = await User.find({}); 
        log.info('Users correctly fetched');
        res.json(users);
    } catch (error) {
        log.error(`Something went wrong. Review the fetch: ${error}`)
        res.status(500).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    }

    // User.find({}).then((users) => {
    //     log.info('Users correctly fetched');
    //     res.json(users);
    // }).catch((error) => {
    //     log.error(`Something went wrong. Review the fetch: ${error}`)
    //     res.status(500).json({
    //         _message: error._message,
    //         name: error.name,
    //         message: error.message
    //     });
    // });
});
log.info(`Users GET endpoint ${props.endpoints.users} registered`);

app.get(props.endpoints.user, async (req, res) => {
    log.info(`GET request received to ${props.endpoints.user} endpoint with params ${JSON.stringify(req.params)}`);
    const idToFetch = req.params.id;
    if(idToFetch) {
        try {
            const user = await User.findById(idToFetch);
            log.info(`User correctly fetched: ${JSON.stringify(user)}`);
            res.json(user);
        } catch (error) {
            log.error(`Something went wrong. Review the fetch: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        }

        // User.findById(idToFetch).then((user) => {
        //     log.info(`User correctly fetched: ${JSON.stringify(user)}`);
        //     res.json(user);
        // }).catch((error) => {
        //     log.error(`Something went wrong. Review the fetch: ${error}`)
        //     res.status(500).json({
        //         _message: error._message,
        //         name: error.name,
        //         message: error.message
        //     });
        // });
    } else {
        res.status(400).json({
            message: 'Missing required id route param'
        });
    }
});
log.info(`User GET endpoint ${props.endpoints.user} registered`);

app.patch(props.endpoints.user, async (req, res) => {
    log.info(`PATCH request received to ${props.endpoints.user} endpoint with params ${JSON.stringify(req.params)}`);
    if(req.params) {
        if(req.body) {            
            if(Object.keys(req.body).every(update => props.model.User.allowedUpdates.includes(update))) {
                try {
                    const user = await User.findByIdAndUpdate(
                        req.params.id, // the id to be search
                        req.body, // the info to be updated
                        {// options
                            new: true, // to return the object just updated
                            runValidators: true // to perform validations before update
                        });
                    if(user) {
                        log.info(`User correctly updated: ${user}`);
                        res.json(user);
                    } else {
                        log.error('User not found or updated. Review the request')
                        res.status(404).json({
                            message: 'User not found or updated'
                        });    
                    }    
                } catch (error) {
                    log.error(`Something went wrong. Review the update: ${error}`)
                    res.status(500).json({
                        _message: error._message,
                        name: error.name,
                        message: error.message
                    });
                }                
            } else {
                log.warn(`Something went wrong. Review allowed updates`)
                res.status(400).json({
                    message: 'Updated invalid or not allowed'
                });
            }
        } else {
            log.warn(`Something went wrong. Review the body request`)
            res.status(400).json({
                message: 'Request body required'
            });
        }
    } else {
        log.warn(`Something went wrong. Review id param`)
        res.status(400).json({
            message: 'Id request param required'
        });
    }    
});
log.info(`User PATCH endpoint ${props.endpoints.user} registered`);

app.delete(props.endpoints.user, async (req, res) => {
    if(req.params){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if(user) {
                log.info(`User correctly deleted: ${user}`);
                res.json(user);
            } else {
                log.error('User not found or deleted. Review the request')
                res.status(404).json({
                    message: 'User not found or deleted'
                });    
            }
        } catch (error) {
            log.error(`Something went wrong. Review the deletion: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        }
    } else {
        log.warn(`Something went wrong. Review id param`)
        res.status(400).json({
            message: 'Id request param required'
        });
    }
});
log.info(`User DELETE endpoint ${props.endpoints.user} registered`);

app.post(props.endpoints.tasks, async (req, res) => {
    log.info(`POST request received to ${props.endpoints.tasks} endpoint`);
    const taskToSave = new Task(req.body);
    log.info(`Task to save: ${JSON.stringify(taskToSave)}`);
    try {
        await taskToSave.save();
        log.info(`Task correctly saved: ${JSON.stringify(taskToSave)}`);
        res.json(taskToSave);
    } catch (error) {
        log.error(`Something went wrong. Review the saving: ${error}`)
        res.status(400).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    }

    // taskToSave.save().then(() => {
    //     log.info(`Task correctly saved: ${JSON.stringify(taskToSave)}`);
    //     res.json(taskToSave);
    // }).catch((error) => {
    //     log.error(`Something went wrong. Review the saving: ${error}`)
    //     res.status(400).json({
    //         _message: error._message,
    //         name: error.name,
    //         message: error.message
    //     });
    // });       
});
log.info(`Tasks POST endpoint ${props.endpoints.tasks} registered`);

app.get(props.endpoints.tasks, async (req, res) => {
    log.info(`GET request received to ${props.endpoints.tasks} endpoint`);
    try {
        const tasks = await Task.find({});
        log.info('Tasks correctly fetched');
        res.json(tasks);
    } catch (error) {
        log.error(`Something went wrong. Review the fetch: ${error}`)
        res.status(500).json({
            _message: error._message,
            name: error.name,
            message: error.message
        });
    }

    // Task.find({}).then((tasks) => {
    //     log.info('Tasks correctly fetched');
    //     res.json(tasks);
    // }).catch((error) => {
    //     log.error(`Something went wrong. Review the fetch: ${error}`)
    //     res.status(500).json({
    //         _message: error._message,
    //         name: error.name,
    //         message: error.message
    //     });
    // });
});
log.info(`Tasks GET endpoint ${props.endpoints.tasks} registered`);

app.get(props.endpoints.task, async (req, res) => {
    log.info(`GET request received to ${props.endpoints.task} endpoint with params ${JSON.stringify(req.params)}`);
    const idToFetch = req.params.id;
    if(idToFetch) {
        try {
            const task = await Task.findById(idToFetch); 
            log.info(`Task correctly fetched: ${JSON.stringify(task)}`);
            res.json(task);    
        } catch (error) {
            log.error(`Something went wrong. Review the fetch: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        }        

        // Task.findById(idToFetch).then((task) => {
        //     log.info(`Task correctly fetched: ${JSON.stringify(task)}`);
        //     res.json(task);
        // }).catch((error) => {
        //     log.error(`Something went wrong. Review the fetch: ${error}`)
        //     res.status(500).json({
        //         _message: error._message,
        //         name: error.name,
        //         message: error.message
        //     });
        // });
    } else {
        res.status(400).json({
            message: 'Missing required id route param'
        });
    }
});
log.info(`Task GET endpoint ${props.endpoints.task} registered`);

app.patch(props.endpoints.task, async (req, res) => {
    log.info(`PATCH request received to ${props.endpoints.task} endpoint with params ${JSON.stringify(req.params)}`);
    if(req.params) {
        if(req.body) {            
            if(Object.keys(req.body).every(update => props.model.Task.allowedUpdates.includes(update))) {
                try {
                    const task = await Task.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        {
                            new: true, 
                            runValidators: true 
                        });
                    if(task) {
                        log.info(`Task correctly updated: ${task}`);
                        res.json(task);
                    } else {
                        log.error('Task not found or updated. Review the request')
                        res.status(404).json({
                            message: 'Task not found or updated'
                        });    
                    }    
                } catch (error) {
                    log.error(`Something went wrong. Review the update: ${error}`)
                    res.status(500).json({
                        _message: error._message,
                        name: error.name,
                        message: error.message
                    });
                }                
            } else {
                log.warn(`Something went wrong. Review allowed updates`)
                res.status(400).json({
                    message: 'Updated invalid or not allowed'
                });
            }
        } else {
            log.warn(`Something went wrong. Review the body request`)
            res.status(400).json({
                message: 'Request body required'
            });
        }
    } else {
        log.warn(`Something went wrong. Review id param`)
        res.status(400).json({
            message: 'Id request param required'
        });
    }    
});
log.info(`Task PATCH endpoint ${props.endpoints.task} registered`);

app.delete(props.endpoints.task, async (req, res) => {
    if(req.params){
        try {
            const task = await Task.findByIdAndDelete(req.params.id);
            if(task) {
                log.info(`Task correctly deleted: ${task}`);
                res.json(task);
            } else {
                log.error('Task not found or deleted. Review the request')
                res.status(404).json({
                    message: 'Task not found or deleted'
                });    
            }
        } catch (error) {
            log.error(`Something went wrong. Review the deletion: ${error}`)
            res.status(500).json({
                _message: error._message,
                name: error.name,
                message: error.message
            });
        }
    } else {
        log.warn(`Something went wrong. Review id param`)
        res.status(400).json({
            message: 'Id request param required'
        });
    }
});
log.info(`Task DELETE endpoint ${props.endpoints.user} registered`);

const defaultPort = process.env.PORT || props.server.defaultPort;
app.listen(defaultPort, () => {
    log.info(`Server up & runnig in port ${defaultPort}`);
});