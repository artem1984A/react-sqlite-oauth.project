
const User = require('./user.model');
const sequelize = require('../../config/database.js');
const { DataTypes, Model } = require('sequelize');

class Event extends Model {}

Event.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryIds: {
        type: DataTypes.JSON, // Storing category IDs as an array in JSON format
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,  // Assuming `createdBy` is a user ID
        references: {
            model: User,
            key: 'id,'
        },
        allowNull: false,
      },
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
      
        timestamps: false,  // CreatedAt and UpdatedAt fields are added automatically
      });
    
    module.exports = Event;