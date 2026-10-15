const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./config/database');
const { User } = require('./models/user');
const { validateSignUpData, validateLoginData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');

// Instance of server
const app = express();

/* Middlewares */
// Convert JSON to JavaScript Object in req object
app.use(express.json());

// Read the Cookies data
app.use(cookieParser());


app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);
    } catch (error) {
        res.status(400).send("ERR : " + error.message)
    }
})

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId;

        const user = await User.findOne({ emailId: userEmail }, "firstName");
        if (!user) {
            res.status(404).send("User not found");
        }

        res.status(200).send(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(400).send("No users found")
        }
        else {
            res.status(200).send(users)
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
})

app.delete("/user", async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User not found!");
        }

        res.status(200).send("User deleted successfully!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server error");
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req?.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "age", "gender", "photoUrl", "about", "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every(k =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills can't exceed 10");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.status(200).send("User updated successfully!");
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error: " + error.message);
    }
})

// Database connection
connectDB()
    .then(() => {
        console.log("Database connected")

        // Start server
        app.listen(7777, () => {
            console.log("Server running on 7777")
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!")
    });
