require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = require("./routes");
const initializeDatabase = require("./sequelize/db.init");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

const port = process.env.API_PORT;
const host = process.env.API_HOST;

initializeDatabase().then(() => {
    app.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}).catch((error) => {
    console.error('Server starting failed : ', error);
});