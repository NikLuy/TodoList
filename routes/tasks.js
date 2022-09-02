const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const User = require('../models/user')
const TaskModule = require('../modules/taskModule')
const TodoLists = require('../models/todolist')

//All Task Route
router.get('/', async (req,res)=>{
try {
   params = await TaskModule.renderPage(req);
   res.render('tasks/index', params)
} catch (error) {
   res.redirect('/')
}
})

//New Users Route
router.get('/new',  async (req,res)=>{
   renderNewPage(res, new Task())
})

router.get('/:id/edit',  async (req,res)=>{
   renderEditPage(res,req)
})

//Create new Task Route
router.post('/', async (req,res)=>{
   const task = new Task({
      content : req.body.content,
      user: req.body.user,
      todolist: req.body.todolist
   })
   try {
      const newTask = await task.save()
      res.redirect(`/`) 
   } catch (error) {
      res.redirect(`/`) 
      console.log(error)
      //renderNewPage(res, new Task(), true)
   }
})

//Update Task Route
router.put('/:id', async (req,res)=>{
   let tasks 
   let id 
   let task
   try {
      console.log('TaskPut')
      tasks = Task.find({})
      id = req.params.id
      task = await Task.findById(req.params.id)
      task.content = req.body.content,
      task.user= req.body.user,
      task.todolist= req.body.todolist
      if(req.body.cover != null && req.body.cover != ''){
         saveCover(task, req.body.cover)
      }
      await task.save()

      res.redirect(`/`) 

   }catch (error){
       console.log(error)
      if(task != null){
         renderEditPage(res, req,true)
      }else{
         redirect('/')
      }
   }
})


router.post("/:id/check",async (req, res, next) => {
   try {
      const id = req.params.id;
      const task =  await Task.findById(id);
      await Task.findByIdAndUpdate(id, { done: !task.done });
      res.redirect("/");
   } catch (error) {
      console.warn(error)
      res.redirect("/");
   }
});

//Create new Task Route
router.post('/', async (req,res)=>{
   const task = new Task({
      content : req.body.content,
      user: req.body.user,
      todolist: req.body.todolist
   })
   try {
      const newTask = await task.save()
      res.redirect(`/`) 
   } catch (error) {
      warn(error)
      renderNewPage(res, new Task(), true)
   }
})

//Show Task Route
router.get('/:id', async (req,res)=>{

      res.redirect('/')

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

async function renderEditPage(res,req, hasError = false){
   try {
      if(hasError)console.log("Error while Uptadting")
      params = await TaskModule.renderPage(req);
      res.render('tasks/edit', params)
   } catch (error) {
      console.log(error)
      res.redirect('/')
   }
}

async function renderNewPage(res, task, id, hasError = false){
   renderFormPage(res, task, "new" ,id,hasError)
}
async function renderFormPage(res, task,form,id, hasError = false){
   try {
      const users = await User.find({})
      const todolists  =await TodoLists.find({})
      const params = {
         users:users,
         todolists:todolists,
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
module.exports = router