const express = require('express');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./config/database');
const { User } = require('./models/user');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRequestRouter = require('./routes/request');

// Instance of server
const app = express();

/* Middlewares */
// Convert JSON to JavaScript Object in req object
app.use(express.json());

// Read the Cookies data
app.use(cookieParser());

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

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
