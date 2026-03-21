require('dotenv').config();

const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const pino = require('pino');

const router = express.Router();

// Logger
const logger = pino();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// ================= REGISTER =================
router.post(
    '/register',
    [
        body('email').isEmail(),
        body('password').isLength({ min: 5 }),
        body('firstName').notEmpty(),
        body('lastName').notEmpty(),
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // 1. Connect to DB
            const db = await connectToDatabase();

            // 2. Access collection
            const collection = db.collection("users");

            // 3. Check existing email
            const existingEmail = await collection.findOne({ email: req.body.email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash password
            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(req.body.password, salt);

            // 4. Save user
            const newUser = await collection.insertOne({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
                createdAt: new Date(),
            });

            // 5. Create JWT
            const payload = {
                user: {
                    id: newUser.insertedId,
                },
            };

            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User registered successfully');

            res.status(200).json({
                authtoken,
                email: req.body.email
            });

        } catch (e) {
            logger.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;