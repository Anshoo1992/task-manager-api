const express = require('express');
const router = new express.Router();

const TasksModule = require('../controllers/task');
const authMiddleWare = require('../middleware/auth');

router.post('/tasks',authMiddleWare, TasksModule.createTask)

//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt_desc
//GET /tasks?completed=true
router.get('/tasks',authMiddleWare, TasksModule.getAllTasks);

router.get('/tasks/:id',authMiddleWare, TasksModule.getTaskById);

router.patch('/tasks/:id',authMiddleWare, TasksModule.getTaskAndUpdateById);

router.delete('/tasks/:id',authMiddleWare, TasksModule.deleteTaskById)

module.exports = router;
