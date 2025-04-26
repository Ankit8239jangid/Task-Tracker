import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userInputValidater, verifyToken } from "../middleware/User.auth.js";
import { User, Account } from "../DB/index.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();


// route to get all users' profile
router.get("/all_users", async (req, res) => {
    try {
        // Find all users from the database
        const users = await User.find();  // This will fetch all users

        // If no users are found, return an empty array
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Create an array to store the profile data for all users
        const userProfiles = [];

        for (let user of users) {
            // For each user, fetch the associated account details
            const account = await Account.findOne({ userId: user._id });

            if (!account) {
                continue;  // Skip users without an associated account
            }

            // Push the user's profile data (including account balance) into the array
            userProfiles.push({
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,

            });
        }

        // Return the list of profiles
        return res.json(userProfiles);

    } catch (error) {
        console.error("Error in /profiles route:", error);
        return res.status(500).json({
            message: "Error fetching user profiles",
            error: error.message
        });
    }
});


// route to login user
router.post("/login", verifyToken, async (req, res) => {
    try {
        // Assuming req.userId is set by some authentication middleware
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(401).json({ message: "Account not found" });
        }

        // Assuming the `user` object is stored with the account, or you fetch it here
        const user = await User.findById(req.userId); // Fetching user info based on userId

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.json({
            message: "Logged in successfully with token",
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                balance: account.balance
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});



// route to signup user
router.post("/signup", userInputValidater, async (req, res) => {
    try {
        const { username, password, firstname, lastname } = req.body;

        // First create the user
        const user = await User.create({
            username,
            password,
            firstname,
            lastname
        });

        // Get the user ID from the created user
        const userId = user._id;

        // Create the account with the user ID
        await Account.create({
            userId: userId,  // This should match your schema
            balance: 5000
        });

        // Generate token with expiration and additional claims
        const token = jwt.sign(
            {
                userId: userId,
                username: username
            },
            JWT_SECRET,

        );

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname
            },
            token: token
        });

    } catch (error) {
        console.error("Error in /signup:", error);
        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

export default router;


