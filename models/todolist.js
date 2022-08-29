const mongoose = require("mongoose")
const task = require('./task')
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
    task.find({todolist: this.id}, (err,tasks) => {
        if(err){
            next(err)
        }else if (tasks.length > 0){
            next( new Error('This todolist has still opentasks'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('TodoList', todolistSchema)