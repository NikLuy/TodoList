const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Task = require('../models/task')

//All Users Route
router.get('/',async (req,res)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const users = await User.find(searchOptions)
        res.render('users/index', {
            users:users, 
            searchOptions: req.query
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/',{
            errorMessage: 'Error read Users'
        })
    }
})

//New Users Route
router.get('/new',(req,res)=>{
    res.render('users/new', {user: new User()})
})

//Create Users Route
router.post('/', async (req,res)=>{
    const user = new User({
        name: req.body.name
    })
    try{
        const newUser = await user.save()
        res.redirect(`users/${newUser.id}`) 
    }catch(error) {
        console.log(error)
        res.render('users/new', {
            user:user, 
            errorMessage: 'Error creating User'
        })
    }
})

router.get('/:id',async (req,res)=>{
    try {
        const user =await User.findById(req.params.id)
        const tasks = await Task.find({user:user.id}).exec()
        res.render('users/show',{
            user:user,
            tasksByUser: tasks
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
        user.name = req.body.name
        await user.save()
        res.redirect(`/users/${user.id}`) 
    }catch (error) {
        console.log(error)
        if(user == null){
            res.redirect('/users')
        }else{
            res.redirect(`/users/${user.id}edit`)
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

module.exports = router