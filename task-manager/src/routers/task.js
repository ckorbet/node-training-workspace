const express = require('express');
const { Router } = require('express');
const Task = require('../models/Task');

const props = require('../../resources/properties.json');
const log = require('../utils/winston');
log.info('Props. & winston logging set up');

const router = new Router();

router.post(props.endpoints.tasks, async (req, res) => {
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

router.get(props.endpoints.tasks, async (req, res) => {
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

router.get(props.endpoints.task, async (req, res) => {
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

router.patch(props.endpoints.task, async (req, res) => {
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

router.delete(props.endpoints.task, async (req, res) => {
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

module.exports = router;