const Task = require('../models/task')
const User = require('../models/user')
const TodoLists = require('../models/todolist')
// const { param } = require("../routes/tasks");

async function getArray(mdata) {
    //this gives an object with dates as keys
    console.log(mdata)
   const groups = mdata.reduce((groups, t) => {
     const dateId= t.todolist.id;
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

 async function renderPage(req){
  let query = Task.find()
  if(req.query.content != null && req.query.content != ''){
     query = query.regex('content', new RegExp(req.query.content, 'i'))
  }
  if(req.query.userId  != null && req.query.userId  != '' ){
     query = query.find({user:req.query.userId})
  }
  if(req.query.todolistId  != null && req.query.todolistId  != ''){
     query = query.find({todolist:req.query.todolistId})
  }
  query = query.find({done:false})
  try {
     const tasks = await query
                             .populate('user')  
                             .populate('todolist')
                             .exec()
     const groupedTasks = await getArray(tasks);
     const id = req.params.id;
     let task
     if(id){
      const task = await Task.findById(id)
     }
     const users = await User.find({})
     const todolists  =await TodoLists.find({})
     const params = {
        groupedTasks:groupedTasks,
        searchOptions:req.query,
        users:users,
        todolists:todolists,
        task:task,
        idTask: id
     }
    return params;
  } catch (error) {
    console.log(error)
    return params = {
      groupedTasks,
      searchOptions,
      users,
      todolists,
      idTask
   }
 }
 }
 
 exports.renderPage = renderPage
 exports.getArray = getArray