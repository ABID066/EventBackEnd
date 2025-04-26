const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const protect = require('./middlewares/authMiddleware');

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');



const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Set security headers


// Rate Limiting: Limit requests to avoid DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

dotenv.config();

connectDB();


app.use(express.json());  // To parse JSON request bodies

app.use('/api/auth', authRoutes);
app.use('/api/events', protect, eventRoutes); // Protect routes


app.use("*", (req, res) => {
    res.status(404).json({ msg: "Wrong URL" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
