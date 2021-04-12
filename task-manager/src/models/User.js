const mongoose = require('mongoose');
const bscryptjs = require('bcryptjs');
const { isEmail, isStrongPassword } = require('validator');
const jwt = require('jsonwebtoken');

const props = require('../../resources/properties.json');
const log = require('../utils/winston');

const userSchema = mongoose.Schema({
    name: { 
        type: String,
        trim: true
    },  
    lastName: { 
        type: String,
        trim: true
    },
    age: { 
        type: Number,
        min: 0,
    },
    email: { 
        type: String, 
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: value => {
              return isEmail(value);
            },
            message: props => `${props.value} is not a valid email`
          },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        validate: {
            validator: value => {
                return isStrongPassword(value) && !value.includes('password');
            },
            message: props => `${props.value} is not a strong password`
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

/*
 * Following lines is the proper way to add non-static function to the schema,
 * in other words, to add instance methods to the model
 * IMPORTANT: Arrow function cannot be used because they change the scope of 'this' 
 */
userSchema.methods.generateAuthToken = async function () {    
    const token = jwt.sign({ _id: this._id.toString()}, props.jwt.secret);
    log.info('JWT token generated');
    this.tokens = this.tokens.concat({ token });
    await this.save();
    log.info('JWT token saved');
};

/*
 * Following lines is the proper way to add static functions to schema,
 * in other words, to add non-instance methods to the model
 * IMPORTANT: Arrow function cannot be used because they change the scope of 'this' 
 */
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    log.info('User to login found');
    const isMatch = await bscryptjs.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

/*
 * Follwing lines is the proper way to add hooks to the schema or model
 * IMPORTANT: Arrow function cannot be used because they change the scope of 'this' 
 */
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bscryptjs.hash(user.password, 8);
        log.info('Password hashed');
    }
    next();
});

module.exports = mongoose.model('User', userSchema);