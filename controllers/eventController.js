const Event = require('../models/EventModel');

// Create a new event
exports.createEvent = async (req, res) => {
    const { name, date, time, location, description, category } = req.body;

    try {
        const newEvent = new Event({
            name,
            date,
            time,
            location,
            description,
            category,
            createEmail: req.user.email, // Store the user's email who created the event
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        // Assuming the user is authenticated and their email is available in req.user.email
        const userEmail = req.user.email;

        // Find events created by the authenticated user
        const events = await Event.find({ createEmail: userEmail });

        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get event details by ID
exports.getEventDetails = async (req, res) => {
    try {
        // Get the email of the authenticated user
        const userEmail = req.user.email;

        // Find the event by its ID and ensure it belongs to the authenticated user
        const event = await Event.findOne({ _id: req.params.id, createEmail: userEmail });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you do not have permission to view this event' });
        }

        res.status(200).json({ event });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Update event
exports.updateEvent = async (req, res) => {
    const { name, date, time, location, description, category } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure the user is the creator of the event
        if (event.createEmail !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        event.name = name;
        event.date = date;
        event.time = time;
        event.location = location;
        event.description = description;
        event.category = category;

        await event.save();
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure the user is the creator of the event
        if (event.createEmail !== req.user.email) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Event.findByIdAndDelete(req.params.id); // Replacing remove with findByIdAndDelete
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Filter events by category
exports.getEventsByCategory = async (req, res) => {
    const { category } = req.params; // Get category from the URL params
    const userEmail = req.user.email; // Assuming req.user contains the authenticated user's email

    try {
        // Find events by category and ensure that the event belongs to the authenticated user
        const events = await Event.find({ category, createEmail: userEmail });

        if (events.length === 0) {
            return res.status(404).json({ message: 'No events found in this category for your account' });
        }

        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

