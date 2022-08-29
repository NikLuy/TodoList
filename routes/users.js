const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Task = require('../models/task')
const bcrypt = require('bcrypt')

//All Users Route
router.get('/',async (req,res)=>{
    await renderUserIndexPage(req,res)
})

//Create Users Route
router.post('/', async (req,res)=>{
    var user
    try{
        user = new User({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            initials : req.body.initials,
            email: req.body.email,
            password: req.body.password
         })
        const hashedPassword =await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        const newUser = await user.save()
        res.redirect(`users/`) 
    }catch(error) {
        console.log(error)
        if(error.code === 11000){
            renderUserIndexPage(req, res, user , `User with same Initials(${req.body.initials}) already exists`)
          }else{
          console.log(error);
          renderUserIndexPage(req, res, user , error)
          }
    }
})

router.get('/:id',async (req,res)=>{
    try {
        const user =await User.findById(req.params.id)
        const tasks = await Task.find({user:user.id})
                                .populate('user')  
                                .populate('todolist')
                                .exec()
        res.render('users/show',{
            user:user,
            tasks: tasks
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/:id/edit',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        res.render('users/edit', {user:user})
    } catch (error) {
        console.log(error)
        res.redirect('/users')
    }
})

router.put('/:id',async(req,res)=>{
    let user 
    try{
        user = await User.findById(req.params.id)
        user.firstname = req.body.firstname,
        user.lastname = req.body.lastname,
        user.initials = req.body.initials,
        user.email = req.body.email,
        await user.save()
        res.redirect(`/users/${user.id}/edit`) 
    }catch (error) {
        console.log(error)
        if(user == null){
            res.redirect('/users')
        }else{
            res.redirect(`/users/${user.id}/edit`)
        }
    }
})

router.delete('/:id',async (req,res)=>{
    let user 
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/users') 
    }catch(error) {
        console.log(error)
        if(user == null){
            res.redirect('/users')
        }else{
            res.redirect(`/users/${user.id}`)
        }
    }
})

async function renderUserIndexPage(req,res, user = new User, errorMessage = null){
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        let re = new RegExp(req.query.name, 'i');
        searchOptions = {lastname: re }
    }
     try {
     
        const users = await User.find(searchOptions).exec();
        res.render('users/index', {
            users:users, 
            user:user,
            searchOptions: req.query,
            errorMessage:errorMessage
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/',{
            errorMessage: 'Error read Users'
        })
    }
}

module.exports = router