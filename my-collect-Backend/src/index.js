const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// default GET route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to MyCollect Api !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});