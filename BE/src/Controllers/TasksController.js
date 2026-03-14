import Task from "../Models/Task.js"

export const getAllTasks = async (req, res) => {
    const pageSize = 5;
    const { filter = 'today', pageNumber = 1 } = req.query;
    const now = new Date();
    let startDate;

    switch (filter) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'all':
        default:
            startDate = null;
            break;
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};
    try {
        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (pageNumber - 1) * pageSize },
                        { $limit: pageSize }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ],
                    activeCount: [{ $match: { status: 'active' } }, { $count: "count" }],
                    completeCount: [{ $match: { status: 'complete' } }, { $count: "count" }]
                }
            }
        ])
        const tasks = result[0].tasks;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        const totalPages = Math.ceil( totalCount / pageSize);
        return res.status(200).json({ tasks, activeCount, completeCount, totalPages });
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