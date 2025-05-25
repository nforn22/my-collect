require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to MyCollect Api !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

module.exports = app;

// start the server (only if not in test environnement)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  mongoose.connect(process.env.MONGODB_URI)
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  });
};
