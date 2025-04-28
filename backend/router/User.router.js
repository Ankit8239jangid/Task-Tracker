import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userInputValidater, verifyToken } from '../middleware/User.auth.js';
import { User } from '../DB/UserSchema/User_Schema.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();



// Route to login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'Lax'
        });

        // Also return the token in the response body for the frontend to store
        return res.json({
            message: "Logged in successfully",
            user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, country: user.country },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to signup user
router.post("/signup", userInputValidater, async (req, res) => {
    try {
        const { email, password, firstname, lastname, country } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword, firstname, lastname, country });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'Lax'
        });

        // Also return the token in the response body for the frontend to store
        return res.status(201).json({
            message: "User created successfully",
            user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, country: user.country },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Route to logout user
router.post("/logout", (_req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to get current user info
router.get("/me", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user: { id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, country: user.country } });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
});

export default router;
