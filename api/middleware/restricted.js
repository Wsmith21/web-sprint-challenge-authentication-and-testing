// ./middleware/restricted.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const formattedToken = token.split(' ')[1]; // Extract the token value
  try {
    const decodedToken = jwt.verify(formattedToken, 'your_secret_key');
    req.decodedToken = decodedToken; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or endpoint
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
