const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const USERSLogHstry = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: 1 },
    ipAddress: { type: String, lowercase: true, index: 1 },
    location: { type: String, lowercase: true, index: 1 },
    browser_name: { type: String },
    os: { type: String },

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'USERS_LOG_HSTRY', USERSLogHstry, dbPrefix + 'USERS_LOG_HSTRY');