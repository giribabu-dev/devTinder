const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://giribabuannapareddi:Radha_8829@cluster0.u4whzzx.mongodb.net/devTinder"
    )
};

module.exports = { connectDB };