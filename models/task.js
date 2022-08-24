const mongoose = require('mongoose');
const machine = require('./machine');
const user = require('./user');

const taskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    machine:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Machine'
    },
    done: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Task',taskSchema);