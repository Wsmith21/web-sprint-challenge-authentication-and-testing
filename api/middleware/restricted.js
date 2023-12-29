const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.baseUrl === '/api/jokes') {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    // Verify the token here using jwt.verify for validation
    jwt.verify(token, 'your_secret_key', (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalid' });
      }

      // Token is valid, proceed to the jokes route
      next();
    });
  } else {
    // For other routes, proceed to the next middleware
    next();
  }
};
