const mongoose = require("mongoose")
const task = require('./task')

const machineSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

machineSchema.pre('remove', function(next){
    task.find({machine: this.id}, (err,tasks) => {
        if(err){
            next(err)
        }else if (tasks.length > 0){
            next( new Error('This machine has still opentasks'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('Machine', machineSchema)