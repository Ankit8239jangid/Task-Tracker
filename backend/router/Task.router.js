import express from 'express';
import { verifyToken } from '../middleware/User.auth.js';
import { Task } from '../DB/UserSchema/Task_Schema.js';
import { Project } from '../DB/UserSchema/Project_Schema.js';
import { validateTaskInput, validateTaskUpdateInput } from '../middleware/Task_middleware.js';

const router = express.Router();

// Create Task
router.post("/", verifyToken, validateTaskInput, async (req, res) => {
    try {
        const { title, description, projectId } = req.body;
        const userId = req.userId;

        const project = await Project.findOne({ _id: projectId, user: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        const task = new Task({ title, description, project: projectId });
        await task.save();

        return res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

// Get all Tasks for a Project
router.get("/:projectId", verifyToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId;

        const project = await Project.findOne({ _id: projectId, user: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        const tasks = await Task.find({ project: projectId });
        return res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
});

// Update Task
router.put("/:taskId", verifyToken, validateTaskUpdateInput, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        const userId = req.userId;

        const task = await Task.findById(taskId).populate('project');

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.project.user.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to update task" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        if (status === 'Completed' && !task.completedAt) {
            task.completedAt = new Date();
        }

        await task.save();
        return res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// Delete Task
router.delete("/:taskId", verifyToken, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.userId;

        const task = await Task.findById(taskId).populate('project');

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.project.user.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete task" });
        }

        await Task.findByIdAndDelete(taskId);
        return res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
});

export default router;
