const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const pino = require('pino');

require('dotenv').config();

const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ REGISTER ROUTE (already done)
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date()
        });

        const payload = {
            user: { id: newUser.insertedId }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({ authtoken });

    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});


// ✅ LOGIN ROUTE (PUT YOUR CODE HERE)
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        const { email, password } = req.body;

        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            user: { id: user._id }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        res.json({
            authtoken,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email
        });

    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;