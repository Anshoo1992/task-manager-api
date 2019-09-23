const Tasks = require('../models/task');

class TasksModule {
    async createTask(req, res) {

        const task = new Tasks({ ...req.body, owner: req.user._id });
        try {
            await task.save();
            return res.status(200).send(task);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }

    async getAllTasks(req, res) {
        const match = {}, sort = {};

        if (req.query.completed) match.completed = req.query.completed === 'true';

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split('_');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        try {
            await req.user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
            return res.status(201).send(req.user.tasks);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    };

    async getTaskById(req, res) {
        try {
            const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id });
            if (!task) return res.status(404).send('Not Found');
            return res.status(201).send(task);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    };

    async getTaskAndUpdateById(req, res) {
        try {
            const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
            if (!task) return res.status(404).send('Not Found');
            return res.status(201).send(task);
        } catch (error) {
            return res.status(400).send('Error occured!!!' + error);
        }
    };

    async deleteTaskById(req, res) {
        try {
            const task = await Tasks.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
            if (!task) return res.status(404).send('Task not found');
            return res.status(200).send(task);
        } catch (error) {
            return res.status(500).send('Error occured!!!' + error);
        }
    }
}

module.exports = new TasksModule();