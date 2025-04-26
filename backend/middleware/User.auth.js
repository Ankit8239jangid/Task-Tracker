import jwt from "jsonwebtoken";
import { User } from "../DB/UserSchema/User_Schema.js";
import { z } from "zod";
import dotenv from "dotenv";
import cookie from "cookie-parser";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "task-tracker-secret";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstname: z.string(),
    lastname: z.string(),
    country: z.string(),
});

// Function to validate user input
async function userInputValidater(req, res, next) {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message);
            return res.status(400).json({ message: "Invalid input data", errors: errorMessages });
        }

        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyToken = (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token) {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Authorization token required" });
            }

            token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: "Token not provided" });
            }
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { userInputValidater };
