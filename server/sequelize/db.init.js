require('dotenv').config({ path: '.env.local' });
const sequelize = require('./db');
const User = require('./models/user');
const Device = require('./models/device');

const userData = [
    {
        username: 'admin',
        password: 'admin',
    }
];

const deviceData = [
    {
        name: 'Fronius Primo',
        dataFetcher: {
            type: 'api',
            url: 'http://192.168.0.22/solar_api/v1/GetInverterRealtimeData.cgi',
            queries: {
                Scope: "Device",
                DataCollection: "CommonInverterData",
                DeviceId: 1,
            }
        },
    },
    {
        name: 'Linky',
        dataFetcher: {
            type: 'api',
            url: 'https://conso.boris.sh/api/daily_consumption',
            queries: {
                prm: process.env.LINKY_PRM,
                start: "2024-01-01",
                end: "2024-03-01",
            },
            headers: {
                Authorization: `Bearer ${process.env.LINKY_TOKEN}`
            }
        },
    }
];

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const existingUsers = await User.findAll();
        for (const user of userData) {
            if (!existingUsers.find(u => u.username === user.username))
                await User.create(user);
        }

        const existingDevices = await Device.findAll();
        for (const device of deviceData) {
            if (!existingDevices.find(d => d.name === device.name)) {
                await Device.create(device);
            }
        }

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

module.exports = initializeDatabase;