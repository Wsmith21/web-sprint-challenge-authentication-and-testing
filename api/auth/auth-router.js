const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Placeholder for users (static array acting as persistent storage)
const users = [];

// Endpoint for user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the users array
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      return res.status(400).json({ message: 'username taken' });
    }

    // Hash the password before storing it (in a real app, store in a database hashed)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object to save (in a real app, save to a database)
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Push the new user to the users array (in a real app, save to a database)
    users.push(newUser);

    const userId = users.length - 1;

    // Return user details upon successful registration with ID and username
    return res.status(201).json({ id: userId, username: newUser.username });
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
