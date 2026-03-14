import express from "express"
import tasksRouter from "./src/Routes/tasksRouters.js" 
import connectDb from "./src/config/db.js";
import dotenv from "dotenv"
import cors from 'cors'
import path from 'path'

dotenv.config();

const app = express();
const __dirname = path.resolve();


app.use(express.json());

if(process.env.NODE_ENV !== 'production')
{
    app.use(cors());
}



app.use("/api/tasks", tasksRouter);

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname,"../FE/dist")))
    
    app.get("*", (req,res) =>{
        res.sendFile(path.join(__dirname,"../FE/dist/index.html"));
    });
}

connectDb().then(() =>{
    app.listen(process.env.PORT, () => {
        console.log('Server started ');
        console.log(`Listening on port ${process.env.PORT}`);
        console.log(`http://localhost:${process.env.PORT}`);
    })
});



