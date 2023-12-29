const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const knex = require('knex')({
  client: 'sqlite3', // Replace this with your actual database client (MySQL, PostgreSQL, etc.)
  connection: {
    filename: 'data', // Replace this with your database connection details
  },
});

// Endpoint for user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the users table
    const existingUser = await knex('users').where({ username }).first();

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the users table
    const [newUserId] = await knex('users').insert({
      username,
      password: hashedPassword,
    });

    // Return user details upon successful registration
    return res.status(201).json({ id: newUserId, username });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});






// Endpoint for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  // Find user by username in the users array
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  try {
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
