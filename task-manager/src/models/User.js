const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const User = mongoose.model('User', {
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

module.exports = User;