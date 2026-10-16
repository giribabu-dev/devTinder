const express = require('express');

const { userAuth } = require('../middlewares/auth');

const connectionRequestRouter = express.Router();

module.exports = connectionRequestRouter;