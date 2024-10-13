// models/sqlmodels/user.model.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite')
});

// Define the current_user model
const CurrentUser = sequelize.define('CurrentUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'current_user', // Explicitly specify the table name
  timestamps: false, // Disable createdAt and updatedAt timestamps
});

module.exports = CurrentUser;

// Sync the model to ensure the table exists (for development purposes only)
sequelize.sync().then(() => {
  console.log('CurrentUser table synced');
}).catch((error) => {
  console.error('Error syncing CurrentUser table:', error);
});