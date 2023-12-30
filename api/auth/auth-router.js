const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const knex = require('knex')
const knexfile = require('../knexfile.js');




const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

// Initialize Knex with the configuration
const db = knex(config);


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the database
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the 'users' table
    await knex('users').insert({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User registered successfully' });
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

    // Compare provided password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    return res.json({
      message: `Welcome, ${user.username}`,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
