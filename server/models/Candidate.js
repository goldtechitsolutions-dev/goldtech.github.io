const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    stage: {
        type: DataTypes.STRING,
        defaultValue: 'review pending'
    },
    appliedDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    experience: {
        type: DataTypes.INTEGER
    },
    score: {
        type: DataTypes.INTEGER
    },
    source: {
        type: DataTypes.STRING
    },
    resume: {
        type: DataTypes.STRING // URL to S3
    },
    screening: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

module.exports = Candidate;
