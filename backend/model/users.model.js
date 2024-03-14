const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const USERS = new mongoose.Schema({

    userName: { type: String, required: true, lowercase: true, index: 1 },
    email: { type: String, required: true, lowercase: true, index: 1 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], index: 1, default: 'user' },
    dob: { type: Date, required: true },

}, { "versionKey": false }, { timestamps: true });



module.exports = mongoose.model(dbPrefix + 'USERS', USERS, dbPrefix + 'USERS');