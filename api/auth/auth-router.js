const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password required' });
    }

    // Check if username already exists in the database
    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'username taken' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 8); // Maximum 2^8 rounds of hashing

    // Insert the new user into the database
    const newUser = await knex('users').insert({ username, password: hashedPassword });

    res.status(201).json({ id: newUser[0], username, password: hashedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check if the username exists in the database
    const user = await knex('users').where({ username }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If the username and password are correct, generate a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: `Welcome, ${user.username}`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});



function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}


module.exports = router;
