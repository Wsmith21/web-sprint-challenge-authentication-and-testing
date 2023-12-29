// userService.js

const knex = require('knex'); // Import your Knex configuration

const userService = {
  async findByUsername(username) {
    try {
      // Query the database to find a user by username
      const user = await knex('users').where({ username }).first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  async createUser(username, password) {
    try {
      // Insert a new user into the database
      const [newUserId] = await knex('users').insert({ username, password });
      
      // Fetch the newly created user to return its details
      const newUser = await knex('users').where('id', newUserId).first();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // You can add more functions for updating users, deleting users, etc., as needed
};

module.exports = userService;
