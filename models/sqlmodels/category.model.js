const sequelize = require('../../config/database.js');
const { DataTypes, Model } = require('sequelize');




class Category extends Model {}

Category.init({
  
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,

},


  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'Categories',
  
  timestamps: false,
});

module.exports = Category;