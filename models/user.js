const mongoose = require("mongoose")
const task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

userSchema.pre('remove', function(next){
    task.find({user: this.id}, (err,tasks) => {
        if(err){
            next(err)
        }else if (tasks.length > 0){
            next( new Error('This user has still opentasks'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('User', userSchema)