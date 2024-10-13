const { DataTypes, Model } = require('sequelize');


const sequelize = require('../../config/database.js');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
   
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // The image can be optional
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: false,  // CreatedAt and UpdatedAt fields are added automatically
});

module.exports = User;