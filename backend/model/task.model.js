const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const TASKS = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: 1 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'TASKS', TASKS, dbPrefix + 'TASKS');