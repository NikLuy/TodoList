const mongoose = require("mongoose")
const Task = require('./task')
const user = require('./user');

const todolistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    private:{
        type: Boolean,
        default: false
    }
})

todolistSchema.pre('remove', function(next){
    const Task = require('./task')
    Task.find({todolist: this.id}, (err,tasks) => {
        if(err){
            next(err)
        }else if (tasks.length > 0){
            next( new Error('This List has still tasks'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('TodoList', todolistSchema)