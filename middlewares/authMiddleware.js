const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
    const token = req.headers['authorization'];  // Correct way to access the 'authorization' header


    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });  // Find user by email
        if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = user;  // Add user to request for further use
        req.userEmail = decoded.email;  // Add email from token
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = protect;
