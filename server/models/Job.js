const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    applicants: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    postedDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    experience: {
        type: DataTypes.STRING
    },
    salaryRange: {
        type: DataTypes.STRING
    },
    techStack: {
        type: DataTypes.JSON // Sequelize handles JSON stringification
    },
    description: {
        type: DataTypes.TEXT
    },
    responsibilities: {
        type: DataTypes.TEXT
    },
    skills: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Job;
