const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Initialize a counter for assigning user IDs
let userIdCounter = 1;
const users = [];

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the users array
    // const existingUser = users.find(user => user.username === username);

    // if (existingUser) {
    //   return res.status(400).json({ message: 'Username taken' }); // Existing user, status 400
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      id: userIdCounter, // Assign a unique ID (you might use a better way to generate IDs in a real app)
      username,
      password: hashedPassword,
    };

    // Increment the user ID counter for the next user
    userIdCounter++;

    // Simulate adding the user to a database (users array)
    users.push(newUser);

    // Return user details upon successful registration with ID and username
    return res.status(200).json({
      id: newUser.id,
      username: newUser.username,
      password: hashedPassword, // Include hashed password in the response (for testing purposes)
    });
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
