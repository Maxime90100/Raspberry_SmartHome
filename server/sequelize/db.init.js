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
        uri: 'http://192.168.0.22',
        data_endpoint: '/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DataCollection=CommonInverterData&DeviceId=1',
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
            if (!existingDevices.find(d => d.id === device.id))
                await Device.create(device);
        }

        console.log('Database initialize successfully !');
    } catch (error) {
        console.error('Database initialization error : ', error);
    }
};

module.exports = initializeDatabase;