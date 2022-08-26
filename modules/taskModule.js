const Task = require('../models/task')
const User = require('../models/user')
const Machines = require('../models/machine')
// const { param } = require("../routes/tasks");

async function getArray(mdata) {
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

 async function renderPage(req){
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
     const groupedTasks = await getArray(tasks);
     const id = req.params.id;
     const users = await User.find({})
     const machines  =await Machines.find({})
     const params = {
        groupedTasks:groupedTasks,
        searchOptions:req.query,
        users:users,
        machines:machines,
        idTask: id
     }
    return params;
  } catch (error) {
    console.log(error)
    return params = {
      groupedTasks,
      searchOptions,
      users,
      machines,
      idTask
   }
 }
 }
 
 exports.renderPage = renderPage
 exports.getArray = getArray