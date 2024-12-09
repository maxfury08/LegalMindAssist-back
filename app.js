const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const chatbotRoute = require('./src/routes/chatbot-routes');
const authRoute = require('./src/routes/auth-routes');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Use chatbot routes
app.use('/api', chatbotRoute);
app.use('/api/auth', authRoute);

const DB_URI = process.env.DB_URI || null;
mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Start the server
app.listen(port, () => {
  console.log(`Chatbot API listening on: http://localhost:${port}`);
});
