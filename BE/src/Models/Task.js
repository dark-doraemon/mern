import mongoose from "mongoose";

const taskScheme = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["active", "complete"],
            default: "active"
        },
        completeAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true //createdAt and updatedAt automatically created by mongoose
    }
);

//từ schema được định nghĩa tạo một model tên là Task
const Task = mongoose.model("Task", taskScheme);


export default Task;