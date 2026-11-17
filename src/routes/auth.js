const express = require("express");
const bcrypt = require("bcrypt");

const { validateSignUpData, validateLoginData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

// Sign-up or register
authRouter.post("/signup", async (req, res) => {
    try {
        // Validate data
        validateSignUpData(req.body);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        // Creating a new instance of the User model
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await newUser.save();

        return res.status(201).json({
            message: "User added successfully!"
        });
    }
    catch (error) {
        return res.status(400).json({
            message: `ERROR: ${error.message}`
        });
    }
});

// Sign-in or login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate data
        validateLoginData(emailId);

        // Find user by email
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        // const isPasswordValid = await bcrypt.compare(password, user?.password);
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT Token
        const token = await user.getJWT();

        // Store token in cookies
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 7 * 3600000) });
        return res.status(200).json({ message: "Login successful!" });
    }
    catch (error) {
        return res.status(400).json({
            message: `ERROR: ${error.message}`
        });
    }
});

// Logout
authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;