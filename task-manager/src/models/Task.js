const mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
    title: { 
        type: String,
        required: true
    },
    description: { type: String },
    completed: { 
        type: Boolean,
        default: false
    },
});