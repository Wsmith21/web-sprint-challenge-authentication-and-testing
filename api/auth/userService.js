// userService.js

const knex = require('knex'); // Import your Knex configuration

const userService = {
  async findByUsername(username) {
    try {
      // Query the 'users' table to find a user by username
      const user = await knex('users').where({ username }).first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  async createUser(username, hashedPassword) {
    try {
      // Insert a new user into the 'users' table
      const [newUserId] = await knex('users').insert({ username, password: hashedPassword });
      
      // Fetch the newly created user to return its details
      const newUser = await knex('users').where('id', newUserId).first();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Add other functions for updating, deleting, or any other user-related operations as needed
};

module.exports = userService;
