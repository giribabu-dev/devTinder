const express = require('express');

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("request/send/:status/:toUserid", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserid = req.params.toUserid;
        const status = req.params.status;
    }
    catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = connectionRequestRouter;