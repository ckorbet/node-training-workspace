const mongoose = require('mongoose');
const bscryptjs = require('bcryptjs');
const { isEmail, isStrongPassword } = require('validator');

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
    }
});

// IMPORTANT: Arrow function cannot be used because they change the scope of 'this' 
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bscryptjs.hash(user.password, 8);
        log.info('Password hashed');
    }
    next();
});

module.exports = mongoose.model('User', userSchema);