import express from "express";
import { verifyToken } from "../middleware/User.auth.js";
import { Project } from "../DB/UserSchema/Project_Schema.js";
import { validateProjectInput } from "../middleware/Project_middleware.js";


const router = express.Router();





// Create a new project (with 4 project limit)
router.post("/", verifyToken, validateProjectInput, async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.userId;

        // Check if user already has 4 projects
        const projectCount = await Project.countDocuments({ user: userId });

        if (projectCount >= 4) {
            return res.status(400).json({
                message: "Project limit reached. You can have a maximum of 4 projects."
            });
        }

        // Create new project
        const project = await Project.create({
            title,
            user: userId
        });

        return res.status(201).json({
            message: "Project created successfully",
            project: {
                id: project._id,
                title: project.title,
                createdAt: project.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({
            message: "Error creating project",
            error: error.message
        });
    }
});

// Get all projects for the authenticated user
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;

        // Find all projects for this user
        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

        return res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            message: "Error fetching projects",
            error: error.message
        });
    }
});

// Get a single project by ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        // Find the project and verify it belongs to the user
        const project = await Project.findOne({
            _id: projectId,
            user: userId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        return res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({
            message: "Error fetching project",
            error: error.message
        });
    }
});

// Delete a project
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        // Find the project and verify it belongs to the user
        const project = await Project.findOne({
            _id: projectId,
            user: userId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        return res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            message: "Error deleting project",
            error: error.message
        });
    }
});

export default router;
