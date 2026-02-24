const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GenericData = sequelize.define('GenericData', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = GenericData;
