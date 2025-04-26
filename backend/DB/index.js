import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function DataBase() {
    mongoose.connect(process.env.MONGO_URI)// apna database ko connect karo 
    
        .then(() => console.log("Database connected"))
        .catch(err => console.error("Database connection error:", err));
}

export default DataBase;

