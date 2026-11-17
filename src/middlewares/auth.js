const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // Read the token from cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        // Verify the token
        const decodedToken = await jwt.verify(token, "DEVTINDER@#$123");
        const { _id } = decodedToken;

        // Find the user by token
        const user = await User.findById({ _id: _id });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: `ERROR: ${error.message}`
        });
    }
};

module.exports = {
    userAuth
};