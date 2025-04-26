import { z } from "zod";  // Correct import for zod

// Validation schema for task creation
const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required")
});

// Validation schema for task update
const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'Done']).optional()
});

// Middleware to validate task input
export const validateTaskInput = (req, res, next) => {
    try {
        const result = taskSchema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message);
            return res.status(400).json({ message: "Invalid task data", errors: errorMessages });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Middleware to validate task update input
export const validateTaskUpdateInput = (req, res, next) => {
    try {
        const result = taskUpdateSchema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message);
            return res.status(400).json({ message: "Invalid task update data", errors: errorMessages });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
