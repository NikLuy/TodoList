const express = require('express')
const router = express.Router()
const Machine = require('../models/machine')
const TaskModule = require('../modules/taskModule')
const Task = require('../models/task')

//All Machines Route
router.get('/',async (req,res)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const machines = await Machine.find(searchOptions)
        res.render('machines/index', {
            machines:machines, 
            searchOptions: req.query
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/',{
            errorMessage: 'Error read Machines'
        })
    }
})

//New Machines Route
router.get('/new',(req,res)=>{
    res.render('machines/new', {machine: new Machine()})
})

//Create Machines Route
router.post('/', async (req,res)=>{
    const machine = new Machine({
        name: req.body.name
    })
    try{
        const newMachine = await machine.save()
        res.redirect(`machines/${newMachine.id}`) 
    }catch(error) {
        console.log(error)
        res.render('machines/new', {
            machine:machine, 
            errorMessage: 'Error creating Machine'
        })
    }
})

router.get('/:id',async (req,res)=>{
    let machine 
    try {
        machine = await Machine.findById(req.params.id)
        const tasks = await Task.find({machine:machine.id}).populate('user').populate('machine').exec()
        res.render('machines/show',{
            machine:machine,
            tasks : tasks
        })
    } catch (error) {
        console.log(error)
        warn(machine.name)
        res.redirect('/')
    }
})

router.get('/:id/edit',async (req,res)=>{
    try {
        const machine = await Machine.findById(req.params.id)
        res.render('machines/edit', {machine:machine})
    } catch (error) {
        console.log(error)
        res.redirect('/machines')
    }
   
})

router.put('/:id',async(req,res)=>{
    let machine 
    try{
        machine = await Machine.findById(req.params.id)
        machine.name = req.body.name
        await machine.save()
        res.redirect(`/machines/${machine.id}`) 
    }catch (error) {
        console.log(error)
        if(machine == null){
            res.redirect('/machines')
        }else{
            res.redirect(`/machines/${machine.id}edit`)
        }
    }
})

router.delete('/:id',async (req,res)=>{
    let machine 
    try{
        machine = await Machine.findById(req.params.id)
        await machine.remove()
        res.redirect('/machines') 
    }catch(error) {
        console.log(error)
        if(machine == null){
            res.redirect('/machines')
        }else{
            res.redirect(`/machines/${machine.id}`)
        }
    }
})

module.exports = router