const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
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

module.exports = mongoose.model('Task', taskSchema);