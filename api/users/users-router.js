const router = require("express").Router();
const User = require("./users-model");

const { restricted, checkRole } = require('./middleware');

router.get("/", restricted, checkRole("admin"), async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error); // Custom error handling middleware in server.js will catch this
  }
});

module.exports = router;
