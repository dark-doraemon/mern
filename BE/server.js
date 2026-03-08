import express from "express"
import tasksRouter from "./src/Routes/tasksRouters.js" 
import connectDb from "./src/config/db.js";
import dotenv from "dotenv"
import cors from 'cors'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/tasks", tasksRouter);

connectDb().then(() =>{
    app.listen(process.env.PORT, () => {
        console.log('Server started ');
        console.log(`Listening on port ${process.env.PORT}`);
        console.log(`http://localhost:${process.env.PORT}`);
    })
});



