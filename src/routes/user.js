const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

// Get all the pending connection requests of logged-in user
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl"]);
        if (connectionRequests.length == 0) {
            return res.status(200).json({
                message: "No connection requests found",
                data: connectionRequests
            })
        }

        res.status(200).json({
            message: "Fetched connection requests",
            data: connectionRequests
        })
    }
    catch (error) {
        res.status(400).json({
            message: `ERROR : ${error.message}`
        });
    }
})

module.exports = userRouter;