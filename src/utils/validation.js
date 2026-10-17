const validator = require('validator');

const validateSignUpData = (data) => {
    const { firstName, lastName, emailId, password } = data;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (firstName.length < 3 || firstName.length > 50) {
        throw new Error("First Name should be 3-50 characters");
    }
    else if (lastName.length < 1 || lastName.length > 50) {
        throw new Error("Last Name should be 1-50 characters");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter strong password");
    }
};

const validateLoginData = (data) => {
    if (!validator.isEmail(data)) {
        throw new Error("Email is not valid");
    }
}

const validateEditProfileData = (data) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

    const isEditValid = Object.keys(data).every(field => allowedEditFields.includes(field));
    return isEditValid;
}

module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData
};