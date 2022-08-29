const express = require('express')
const router = express.Router()
const Task = require("../models/task")
const User = require('../models/user')
const TodoLists = require('../models/todolist')

// router.get('/', (req,res)=>{

//     res.render('index')
// })
// GET METHOD

router.get("/", (req, res) => {
    Task.find({}, (err, tasks) => {
    res.render('index', { tasks: tasks });
    });
});

//POST METHOD
router.post('/',async (req, res) => {
    const task = new Task({
    content: req.body.content
    });
    try {
    await task.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
});

// router
//     .route("/edit/:id")
//     .get((req, res) => {
//     const id = req.params.id;
//     const users = User.find({})
//     const todolists = TodoLists.find({})
//     Task.find({}, (err, tasks) => {
//     res.render("tasks/edit", { tasks: tasks, idTask: id, users:users, todolists:todolists });
//     });
//     })
//     .post((req, res) => {
//     const id = req.params.id;
//     Task.findByIdAndUpdate(id, { content: req.body.content }, err => {
//     if (err) return res.send(500, err);
//     res.redirect("/");
//     });
// });

// //DELETE
// router.route("/remove/:id").get((req, res) => {
//     const id = req.params.id;
//     Task.findByIdAndRemove(id, err => {
//     if (err) return res.send(500, err);
//     res.redirect("/");
//     });
// });

module.exports = router