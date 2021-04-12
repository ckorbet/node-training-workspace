const jwt = require('jsonwebtoken');
const User = require('../models/User');
const props = require('../../resources/properties.json');
const log = require('../utils/winston');

const auth = async (req, res, next) => {
    log.info('Auth middleware');
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, props.jwt.secret);
        const user = await User.findOne({
            _id: decoded._id, // this is to search the user
            'tokens.token': token // this is to check that actually the user contains the token
        
        });
        if(!user) {
            throw new Error();
        }
        next();
    } catch(error) {
        log.error(error);
        res.status(401).json({error: 'Auth required'});
    }
    req.user = user; // this makes the user available in the next steps through the req
    next();
};

module.exports = auth;