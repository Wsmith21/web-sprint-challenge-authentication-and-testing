const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('./knexfile.js'));

const router = express.Router();

// Initialize a counter for assigning user IDs
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    // Check if the username already exists in the database
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Insert the new user into the 'users' table
    const [userId] = await knex('users').insert({
      username,
      password: hashedPassword,
    });

    // Fetch the newly inserted user from the database
    const newUser = await knex('users').where('id', userId).first();

    return res.status(200).json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password, // Include hashed password in the response (for testing purposes)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});









router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find user by username in the database
    const user = await knex('users').where({ username }).first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with user's hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    // Respond with welcome message and token upon successful login
    res.json({
      message: `Welcome, ${user.username}`,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
