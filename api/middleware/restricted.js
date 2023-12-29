const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ message: 'token required' });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decodedToken) => {
    if (err) {
      // Token is invalid or expired
      return res.status(401).json({ message: 'token invalid' });
    } else {
      // Token is valid, decodedToken can be used in subsequent middleware or routes if needed
      req.decodedToken = decodedToken; // Attach the decoded token to the request object if needed
      next();
    }
  });
};
