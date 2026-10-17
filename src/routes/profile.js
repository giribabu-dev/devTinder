const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

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

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        const isEditAllowed = validateEditProfileData(req?.body);
        if (!isEditAllowed) {
            throw new Error("Invalid edit request");
        }

        const userData = req.user;
        Object.keys(req?.body).forEach(field => userData[field] = req.body[field]);
        userData.save();

        res.status(200).json({
            message: "Profile updated successfully",
            data: userData
        })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error: " + error.message);
    }
})

module.exports = profileRouter;