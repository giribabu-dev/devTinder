const express = require('express');
const bcrypt = require('bcrypt');

const { validateSignUpData, validateLoginData } = require('../utils/validation');
const User = require('../models/user');

const authRouter = express.Router();

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

        res.status(201).send("User added successfully!");
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        // Validate data
        validateLoginData(emailId);

        // Find user by email
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(404).send("Invalid credentials");
        }

        // Compare passwords
        // const isPasswordValid = await bcrypt.compare(password, user?.password);
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            res.status(400).send("Invalid credentials");
        }

        // Create JWT Token
        const token = await user.getJWT();

        // Store token in cookies
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 7 * 3600000) });
        res.status(200).send("Login successful!");
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });

    res.status(200).send("Logout successful");
})

module.exports = authRouter;