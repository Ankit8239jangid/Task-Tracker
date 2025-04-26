import { z } from "zod";  // Correct import for zod

// Validation schema for project creation
const projectSchema = z.object({
    title: z.string().min(1, "Title is required")
});

// Middleware to validate project input
export const validateProjectInput = (req, res, next) => {
    try {
        const result = projectSchema.safeParse(req.body);

        if (!result.success) {
            // Extracting the error messages from the zod validation result
            const errorMessages = result.error.errors.map((err) => err.message);
            return res.status(400).json({ message: "Invalid project data", errors: errorMessages });
        }

        next(); // Proceed to the next middleware if validation is successful
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
