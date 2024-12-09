const express = require('express');
const { handleChatbotRequest } = require('../controller/chatbot-controller');

const router = express.Router();

// Define the chatbot endpoint
router.post('/chatbot', handleChatbotRequest);

module.exports = router;
