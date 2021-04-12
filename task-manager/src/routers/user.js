const express = require('express');
const { Router, response } = require('express');
const User = require('../models/User');

const props = require('../../resources/properties.json');
const log = require('../utils/winston');
log.info('Props. & winston logging set up');

const router = new Router();

router.post(props.endpoints.users, async (req, res) => {
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
});
log.info(`Users POST endpoint ${props.endpoints.users} registered`);

router.post(props.endpoints.login, async (req, res) => {
    log.info(`POST request received to ${props.endpoints.login}`);
    if(req.body) {
        if(Object.keys(req.body).every(loginProp => props.model.User.loginProps.includes(loginProp))) { 
            try {
                const user = await User.findByCredentials(req.body.email, req.body.password);
                res.json(user);
            } catch(error) {
                log.error(`${JSON.stringify(error, null, 2)}`);
                res.status(400).json(error);
            }
        } else {
            log.warn('Missing required email and password')
            res.status(400).json({
                message: 'Missing required email and password'
            });
        }
    } else {
        log.warn('Missing required email and password')
        res.status(400).json({
            message: 'Missing required email and password'
        });
    }
});
log.info(`Login POST endpoint ${props.endpoints.login} registered`);

router.get(props.endpoints.users, async (req, res) => {
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
});
log.info(`Users GET endpoint ${props.endpoints.users} registered`);

router.get(props.endpoints.user, async (req, res) => {
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
    } else {
        res.status(400).json({
            message: 'Missing required id route param'
        });
    }
});
log.info(`User GET endpoint ${props.endpoints.user} registered`);

router.patch(props.endpoints.user, async (req, res) => {
    log.info(`PATCH request received to ${props.endpoints.user} endpoint with params ${JSON.stringify(req.params)}`);
    if(req.params) {
        if(req.body) {            
            if(Object.keys(req.body).every(update => props.model.User.allowedUpdates.includes(update))) {
                try {
                    // Modification required in order to execute password hashing pre-hook
                    const user = await User.findById(req.params.id);                    
                    if(user) {
                        Object.keys(req.body).forEach(update => { user[update] = req.body[update]});
                        const savedUser = await user.save();
                        if(savedUser) {
                            log.info(`User correctly updated: ${savedUser}`);
                            res.json(savedUser);
                        } else {
                            log.error('User not updated. Review the request')
                            res.status(404).json({
                                message: 'User not found or updated'
                            });
                        }
                    } else {
                        log.error('User not found. Review the request')
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

router.delete(props.endpoints.user, async (req, res) => {
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

module.exports = router;