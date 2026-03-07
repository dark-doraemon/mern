import mongoose from "mongoose"


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Database connected")
    }
    catch (error) {
        console.log(error)
        process.exit(1); //process with error
    }
}

export default connectDb