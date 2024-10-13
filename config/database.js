// config/database.js

const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize connected to SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '/Users/artemrizhov/Desktop/winc/www/database.sqlite'  // This path points to your SQLite database file
});

// Test the connection to make sure it works
sequelize.authenticate()
  .then(() => console.log('Connected to SQLite'))
  .catch((err) => console.error('Unable to connect to SQLite:', err));

module.exports = sequelize;