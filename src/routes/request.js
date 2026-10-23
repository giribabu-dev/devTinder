const express = require('express');

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Validation for status
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            })
        };

        // Check if user is exists or not
        const isUserExists = await User.findById({ _id: toUserId });
        if (!isUserExists) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isRequestExists = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: fromUserId,
                    toUserId: toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });
        if (isRequestExists) {
            return res.status(400).json({
                message: "Request already sent"
            })
        }

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await newConnectionRequest.save();
        res.status(200).json({
            message: "Request sent successfully",
            data
        });
    }
    catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        // Validate status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check if connect request is exists or not
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({
            message: `Connection request ${status}`,
            data
        });
    }
    catch (error) {
        console.log("ERROR : " + error.message);
        res.status(400).send("ERR : " + error.message);
    }
})

module.exports = connectionRequestRouter;