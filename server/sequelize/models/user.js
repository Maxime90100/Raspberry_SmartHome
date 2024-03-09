const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../db');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
    },
});

User.prototype.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

User.addScope('defaultScope', {
    attributes: { exclude: ['createdAt','updatedAt','password'] },
});

module.exports = User;