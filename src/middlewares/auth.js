const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        // Read the token from cookies
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token");
        }

        // Verify the token
        const decodedToken = await jwt.verify(token, "DEVTINDER@#$123");
        const { _id } = decodedToken;

        // Find the user by token
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
};

module.exports = {
    userAuth
};