import express from "express";
import DataBase from "./DB/index.js";
import { router } from "./router/router.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
));
app.use(cookieParser());

app.use('/api/v1/', router);

app.get("/", (_req, res) => {
    res.send("hyy this is Task Traker application ");
});

DataBase();
app.listen(PORT, () => {
    console.log(`server is runing on http://localhost:${PORT}`);
});