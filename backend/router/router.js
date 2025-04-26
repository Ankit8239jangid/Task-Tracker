import express from "express";
export const router = express.Router();
import userRoute from "./User.router.js";
import projectRoute from "./Project.router.js";
import taskRoute from "./Task.router.js";

// Auth routes
router.use("/auth", userRoute);

// Project routes
router.use("/projects", projectRoute);

// Task routes
router.use("/tasks", taskRoute);

export default router; // Exporting router for use in other files
