const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const router = express.Router();

// sign-in route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // password security check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.'
            });
        }

        // check if the user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        // if the user already exists
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        // password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // find user
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        };
        // password check
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        };

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        );

        res.json ({
            message: 'Login successfull !',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});


module.exports = router;