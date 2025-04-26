const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    createEmail: { type: String, required: true },  // Changed from creatorId to createEmail
}, {versionKey: false});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
