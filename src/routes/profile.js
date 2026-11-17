const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

// View profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "Fetched user profile",
            user
        });
    }
    catch (error) {
        return res.status(400).json({ message: `ERROR: ${error.message}` })
    }
})

// Update profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const isEditAllowed = validateEditProfileData(req?.body);
        if (!isEditAllowed) {
            return res.status(400).json({
                message: "Invalid edit request"
            });
        }

        const userData = req.user;
        Object.keys(req?.body).forEach(field => userData[field] = req.body[field]);
        userData.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            data: userData
        });
    }
    catch (error) {
        return res.status(400).json({ message: `ERROR: ${error.message}` });
    }
})

module.exports = profileRouter;