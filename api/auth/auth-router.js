const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const User = require('./users/users-module.js');
const { BCRYPT_ROUNDS, JWT_SECRET } = require('./github/config');

router.post('/register', async (req, res, next) => {
  let user = req.body;

  try {
    // bcrypting the password before saving
    const hash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);

    // never save the plain text password in the db
    user.password = hash;

    const savedUser = await User.add(user);

    res.status(201).json({ message: `Great to have you, ${savedUser.username}` });
  } catch (error) {
    next(error); // Custom error handling middleware in server.js will catch this
  }
});

router.post('/login', async (req, res, next) => {
  let { username, password } = req.body;

  try {
    const [user] = await User.findBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);

      // Return the token in the response
      res.status(200).json({
        message: `Welcome back ${user.username}, here's your token...`,
        token, // attach the token as part of the response
      });
    } else {
      next({ status: 401, message: 'Invalid Credentials' });
    }
  } catch (error) {
    next(error);
  }
});

function generateToken(user) {
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
