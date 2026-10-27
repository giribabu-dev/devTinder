const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "skills"];

// Get all the pending connection requests of logged-in user
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const userData = connections.map(connection => {
            if (connection.fromUserId._id.toString() === loggedInUser._id) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        });

        res.status(200).json({
            message: "Connected fetched successfully",
            data: userData
        })
    }
    catch (error) {
        res.status(400).json({
            message: `ERROR : ${error.message}`
        })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const calculateSkip = (page - 1) * limit;

        // Get users data except
        // 1. logged-in user
        // 2. if already connection request is send
        // 3. if already connected

        // Find all the connection request (send, received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        })
            .select("fromUserId toUserId")
        // .populate("fromUserId", "firstName lastName")
        // .populate("toUserId", "firstName lastName")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString())
            hideUsersFromFeed.add(request.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select(USER_SAFE_DATA)
            .skip(calculateSkip)
            .limit(limit);

        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        })
    }
    catch (error) {
        res.status(400).json({
            message: `ERROR : ${error.message}`
        });
    }
})

module.exports = userRouter;