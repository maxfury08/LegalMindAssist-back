const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// User Signup
const signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// User Login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful.', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { signup, login };
