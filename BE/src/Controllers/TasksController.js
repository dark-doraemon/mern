import Task from "../Models/Task.js"

export const getAllTasks = async (req, res) => {
    try {
        const result = await Task.aggregate([
            {
                $facet:{
                    tasks: [{$sort: {createdAt: -1}}],
                    activeCount: [{$match: {status: 'active'}}, {$count: "count"}],
                    completeCount: [{$match: {status: 'complete'}}, {$count: "count"}]
                }
            }
        ])
        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;
        return res.status(200).json({tasks, activeCount, completeCount});
    }
    catch (error) {
        console.error("Error fetching tasks: ", error)
        res.status(500).json({ message: error.message });
    }
}

export const createTask = async (req, res) => {
    try {
        var { title } = req.body;
        const task = new Task({ title });
        const newTask = await task.save();
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Error creating task: ", error)
        res.status(500).json({ message: error.message });
    }
}


export const updateTask = async (req, res) => {
    try {
        var { title, status, completeAt } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completeAt
            },
            { new: true }
        );

        console.log(updatedTask)

        if (!updatedTask) {
            return res.status(404).json({ "message": "Task not found" });
        }

        res.status(200).json(updatedTask)
    }
    catch (error) {
        console.error("Error updating task: ", error)
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        var deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.status(200).json(deletedTask);
    }
    catch (error) {
        console.error("Error deleting task: ", error)
        res.status(500).json({ message: error.message });
    }
}