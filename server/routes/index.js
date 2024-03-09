const express = require('express')
const router = express.Router();
const usersRouter = require('./users.router')
const devicesRouter = require('./devices.router')
const {checkSequelizeErrors} = require("../middlewares/sequelize.middleware");

router.use('/users',usersRouter);
router.use('/devices',devicesRouter);

router.use(checkSequelizeErrors)
module.exports = router;