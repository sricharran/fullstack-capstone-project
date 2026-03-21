const express = require('express');
const router = express.Router();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


// ==================== REGISTER ====================
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
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});


// ==================== LOGIN ====================
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
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});


// ==================== UPDATE ====================
router.put(
    '/update',
    [
        body('firstName').optional().isLength({ min: 1 }),
        body('lastName').optional().isLength({ min: 1 }),
        body('password').optional().isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.header('email');
            if (!email) {
                return res.status(400).json({ message: "Email header missing" });
            }

            const db = await connectToDatabase();
            const collection = db.collection("users");

            let existingUser = await collection.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            let updateFields = {};

            if (req.body.firstName) updateFields.firstName = req.body.firstName;
            if (req.body.lastName) updateFields.lastName = req.body.lastName;

            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                const hash = await bcryptjs.hash(req.body.password, salt);
                updateFields.password = hash;
            }

            updateFields.updatedAt = new Date();

            await collection.updateOne(
                { email },
                { $set: updateFields }
            );

            const updatedUser = await collection.findOne({ email });

            const payload = {
                user: { id: updatedUser._id }
            };

            const authtoken = jwt.sign(payload, JWT_SECRET);

            res.json({ authtoken });

        } catch (e) {
            console.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;