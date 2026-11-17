const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");

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
app.use("/", userRouter);

// Database connection
connectDB()
    .then(() => {
        console.log("Database connected");

        // Start server
        app.listen(7777, () => {
            console.log("Server running on 7777");
        });
    })
    .catch((error) => {
        console.log("Database can't connected", error.message);
    });
