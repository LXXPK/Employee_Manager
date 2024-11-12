const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { f_sno, f_userName, f_Pwd } = req.body;
    try {
        const existingUser = await User.findOne({ f_userName });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPwd = await bcrypt.hash(f_Pwd, 10);

        const newUser = new User({ f_sno, f_userName, f_Pwd: hashedPwd });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;
    try {
        const user = await User.findOne({ f_userName });
        if (!user) return res.status(400).json({ message: 'Invalid login details' });

        const isPasswordValid = await bcrypt.compare(f_Pwd, user.f_Pwd);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid login details' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
