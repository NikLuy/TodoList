const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: false
    },
    lastname:{
        type: String,
        required: false
    },
    initials:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        required: false
    },
    password:{
        type: String,
        required: true
    }
})

userSchema.virtual('name').get(function(){
    var fullname = ''
    if( this.firstname !=null && this.firstname != '' ){
        fullname += this.firstname
    }
    if( this.lastname !=null && this.lastname != '' )
    {
        if(fullname != ''){fullname += ' '}
        fullname += this.lastname
    }
    if(fullname == '')
    {
        return this.initials;
    }
    return fullname;
 })

userSchema.pre('remove', function(next){
    const err = false
    if(err){
        next(err)
        //next( new Error('Message'))
    }else{
        next()
    }
})

module.exports = mongoose.model('User', userSchema)