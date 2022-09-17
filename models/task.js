const mongoose = require('mongoose');
const todolist = require('./todolist');
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
    todolist:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'TodoList'
    },
    done: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Task',taskSchema);