const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is invalid status`
        }
    }
},
    {
        timestamps: true
    }
);

const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;