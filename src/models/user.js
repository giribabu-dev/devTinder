const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must be at least 3 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"],
        trim: true
    },
    lastName: {
        type: String,
        maxLength: [50, "Last name cannot exceed 50 characters"],
        trim: true
    },
    emailId: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        maxLength: [40, "Email cannot exceed 40 characters"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password")
            }
        }
    },
    age: {
        type: Number,
        min: [18, "User must be atleast 18 years old"],
        max: [100, "Please provide a valid age"]
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        },
        trim: true
    },
    photoUrl: {
        type: String,
        default: "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
        trim: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url")
            }
        }
    },
    about: {
        type: String,
        default: "About me",
        maxLength: [500, "About cannot exceed 500 characters"],
        trim: true
    },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: function (skills) {
                return skills.length <= 10
            },
            message: "You can add a maximum of 10 skills"
        }
    }
},
    {
        timestamps: true
    }
);

const User = model("User", userSchema);
module.exports = { User };