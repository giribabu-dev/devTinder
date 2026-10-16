const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).send(user);
    } 
    catch (error) {
        res.status(400).send("ERR : " + error.message)
    }
})

profileRouter.patch("/edit/:userId", async (req, res) => {
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

module.exports = profileRouter;