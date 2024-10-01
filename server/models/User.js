const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    contactDetails: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    pincode: {
        type: String,
        default: ''
    },
    nearbyLocation: {
        type: String,
        default: ''
    },
    houseNo: {
        type: String,
        default: ''
    },
    wallet: {
        type: Number,
        default: 0
    }
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
