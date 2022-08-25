const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const User = require('../models/user')
const Machines = require('../models/machine')

//All Task Route
router.get('/', async (req,res)=>{
   console.log(req.query )
   let query = Task.find()
   if(req.query.content != null && req.query.content != ''){
      query = query.regex('content', new RegExp(req.query.content, 'i'))
   }
   if(req.query.userId  != null && req.query.userId  != '' ){
      query = query.find({user:req.query.userId})
   }
   if(req.query.machineId  != null && req.query.machineId  != ''){
      query = query.find({machine:req.query.machineId})
   }
   try {
      const tasks = await query
                              .populate('user')  
                              .populate('machine')
                              .exec()
      const groupedTasks = await getGroupArray(tasks);
      let id
      const users = await User.find({})
      const machines  =await Machines.find({})
      const params = {
         groupedTasks:groupedTasks,
         searchOptions:req.query,
         users:users,
         machines:machines,
         idTask: id,
      }
      res.render('tasks/index', params)
   } catch (error) {

      res.redirect('/')
   }
})

//New Users Route
router.get('/new',  async (req,res)=>{
   renderNewPage(res, new Task())
})

//Create new Task Route
router.post('/', async (req,res)=>{
   const task = new Task({
      content : req.body.content,
      user: req.body.user,
      machine: req.body.machine
   })
   try {
      const newTask = await task.save()
      res.redirect(`/tasks/${newTask.id}`) 
   } catch (error) {
      warn(error)
      renderNewPage(res, new Task(), true)
   }
})

//Show Task Route
router.get('/:id', async (req,res)=>{
   try {
      const task = await Task.findById(req.params.id)
                              .populate('user')  
                              .populate('machine')
                              .exec()
      res.render('tasks/show',{task:task})
   } catch (error) {
      console.log(error)
      res.redirect('/tasks')
   }
})

router.get('/:id/edit',  async (req,res)=>{
   try {
      const tasks = await Task.find({})
      const id = req.params.id
      renderEditPage(res, tasks,id)
   } catch (error) {
      
   }
})

//Update Task Route
router.put('/:id', async (req,res)=>{
   let tasks 
   let id 
   let task
   try {
      tasks = Task.find({})
      id = req.params.id
      task = await Task.findById(req.params.id)
      task.content = req.body.content,
      task.user= req.body.user,
      task.machine= req.body.machine
      if(req.body.cover != null && req.body.cover != ''){
         saveCover(task, req.body.cover)
      }
      await task.save()
      res.redirect(`/${task.id}`) 

   }catch (error){
       console.log(error)
      if(task != null){
         renderEditPage(res, tasks,id, true)
      }else{
         redirect('/')
      }
   }
})

router.put('/:id/checked', async (req,res)=>{
      res.render("Set Checked") 
})

//Delete Task Route
router.delete('/:id', async (req,res)=>{
   let task 
   try {
      task = await Task.findById(req.params.id)
      await task.remove()
      res.redirect('/')
   } catch (error) {
      if(task != null){
         res.render('/show', {
            task:task ,
            errorMessage: 'Could not remove task'
         })
      }else{
         res.redirect('/')
      }
   }
})

async function renderNewPage(res, task, id, hasError = false){
   renderFormPage(res, task, "new" ,id,hasError)
}
async function renderEditPage(res, task, id, hasError = false){
   renderFormPage(res, task, "edit",id,hasError)
}
async function renderFormPage(res, task,form,id, hasError = false){
   try {
      const users = await User.find({})
      const machines  =await Machines.find({})
      const params = {
         users:users,
         machines:machines,
         task:task,
         idTask: id,
      }
      if(hasError){
         if(form == 'new')params.errorMessage = 'Error Creating'
         else params.errorMessage = 'Error Editing'
      } 
      res.render(`tasks/${form}`, params)
    } catch (error) {
      res.redirect('/')
    }
}
async function getGroupArray(mdata){
   //this gives an object with dates as keys
  const groups = mdata.reduce((groups, t) => {
    const dateId= t.machine.id;
    if (!groups[dateId]) {
      groups[dateId] = [];
    }
    groups[dateId].push(t);
    return groups;
  }, {});
  
  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((mid) => {
    return {
      mid:mid,
      tasks: groups[mid]
    };
  });
  return groupArrays 
}
module.exports = router