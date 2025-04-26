const express = require('express');
const { createEvent, getEvents, getEventDetails, updateEvent, deleteEvent, getEventsByCategory } = require('../controllers/eventController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createEvent);        // Create event (requires authentication)
router.get('/', getEvents);                    // Get all events
router.get('/category/:category', getEventsByCategory);  // Filter events by category (new route)
router.get('/:id', getEventDetails);           // Get event details by ID
router.put('/:id', protect, updateEvent);      // Update event (requires authentication)
router.delete('/:id', protect, deleteEvent);  // Delete event (requires authentication)

module.exports = router;
