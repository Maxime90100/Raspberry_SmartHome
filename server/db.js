const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        dialectOptions: {
            collate: 'en_US.UTF-8',
            name: 'en_US.UTF-8',
        },
    }
);

module.exports = sequelize;
