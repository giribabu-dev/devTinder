const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

// Instance of server
const app = express();

// Middleware
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        const userData = req.body;

        const newUser = new User(userData);
        await newUser.save();

        res.status(201).send("User added successfully!");
    } catch (err) {
        res.status(500).send("Internal server error: " + err.message);
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

app.patch("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const data = req.body;

        const user = await User.findByIdAndUpdate({ _id: userId }, data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        console.log(user);

        res.status(200).send("User updated successfully!");
    }
    catch (error) {
        console.error(error.message);
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
