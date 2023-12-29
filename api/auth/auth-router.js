const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const router = express.Router();

const users = [];

// Endpoint for user registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the username already exists in the mock array (you would typically query a database here)
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user object
    const newUser = {
      username,
      password, // Note: In a real application, passwords should be hashed before storing
    };

    // Add the new user to the mock array (you would typically insert into a database here)
    users.push(newUser);

    // Return the user details in the response upon successful registration
    return res.status(201).json({ id: users.length, username: newUser.username });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user' });
  }
});







router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    const user = await userService.findByUsername(username);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ token: token });
    }

    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    res.json({
      message: `Welcome, ${user.username}`,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: 'invalid credentials' });
  } 
});


module.exports = router;
