const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Device = sequelize.define('Device', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    uri: {
        type: DataTypes.STRING,
        allowNull: true
    },
    data_endpoint: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Device.addScope('defaultScope', {
    attributes: { exclude: ['createdAt','updatedAt'] },
});

module.exports = Device;
