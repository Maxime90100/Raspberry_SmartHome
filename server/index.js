require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const User = require('./models/user');
const router = require("./routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        const admin = await User.findOne({where: {username: 'admin'}});
        if(!admin) await User.create({username: 'admin', password: 'admin'})
        console.log('Database connection success !');

        const port = process.env.API_PORT
        const host = process.env.API_HOST
        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    } catch (error) {
        console.error('Database connection failed : ', error);
    }
})();