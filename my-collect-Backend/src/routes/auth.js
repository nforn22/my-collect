const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const router = express.Router();

// Route d'inscription
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'user existe déjà
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        // Si l'User existe déjà :
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création d'un User
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Création du token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {expireIn: '7d' }
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

// Route connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        //trouvé l'utilisateur
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        };
        // vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        };

        const token = jwt.sign(
            { userId: user._id },
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
})

module.exports = router;