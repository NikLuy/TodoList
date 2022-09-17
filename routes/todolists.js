const express = require('express')
const router = express.Router()
const TodoList = require('../models/todolist')
const TaskModule = require('../modules/taskModule')
const Task = require('../models/task')
const User = require('../models/user')


//All TodoLists Route
router.get('/',async (req,res)=>{
    await renderUserIndexPage(req,res)
})

//New TodoLists Route
router.get('/new',(req,res)=>{
    res.render('todolists/new', {todolist: new TodoList()})
})

//Create TodoLists Route
router.post('/', async (req,res)=>{
    const todolist = new TodoList({
        name: req.body.name,
        user: req.body.user
    })
    try{
        const newTodoList = await todolist.save()
        res.redirect(`todolists/${newTodoList.id}`) 
    }catch(error) {
        console.log(error)
        res.render('todolists/new', {
            todolist:todolist, 
            errorMessage: 'Error creating TodoList'
        })
    }
})

router.get('/:id',async (req,res)=>{
    let todolist 
    try {
        todolist = await TodoList.findById(req.params.id)
        const users = await User.find({})
        const tasks = await Task.find({todolist:todolist.id}).populate('user').populate('todolist').exec()
        res.render('todolists/show',{
            todolist:todolist,
            tasks : tasks,
            users: users
        })
    } catch (error) {
        console.log(error)
        warn(todolist.name)
        res.redirect('/')
    }
})

router.get('/:id/edit',async (req,res)=>{
    try {
        const todolist = await TodoList.findById(req.params.id).populate('user').exec()
        const users = await User.find({})
        res.render('todolists/edit', {todolist:todolist, users:users})
    } catch (error) {
        console.log(error)
        res.redirect('/todolists')
    }
   
})

router.put('/:id',async(req,res)=>{
    let todolist 
    try{
        todolist = await TodoList.findById(req.params.id)
        todolist.name = req.body.name
        await todolist.save()
        res.redirect(`/todolists/${todolist.id}`) 
    }catch (error) {
        console.log(error)
        if(todolist == null){
            res.redirect('/todolists')
        }else{
            res.redirect(`/todolists/${todolist.id}edit`)
        }
    }
})

router.delete('/:id',async (req,res)=>{
    let todolist 
    try{
        console.log(req.params.id)
        todolist = await TodoList.findById(req.params.id)
        await todolist.remove()
        res.redirect('/todolists') 
    }catch(error) {
        console.log(error)
        if(todolist == null){
            res.redirect('/todolists')
        }else{
            res.redirect(`/todolists`)
        }
    }
})

async function renderUserIndexPage(req,res, todolist = new TodoList, errorMessage = null){
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const todolists = await TodoList.find(searchOptions)
        const users = await User.find({})
        res.render('todolists/index', {
            users:users,
            todolist:todolist,
            todolists:todolists, 
            searchOptions: req.query
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/',{
            errorMessage: 'Error read TodoLists'
        })
    }
}


module.exports = router