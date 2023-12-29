const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService'); // Import the userService module for database interactions

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the database
    const existingUser = await userService.findByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await userService.createUser(username, hashedPassword);

    // Return user details upon successful registration
    return res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
});


// Endpoint for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
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
