const express = require('express')
const router = express.Router();
const usersRouter = require('./users.router')
const devicesRouter = require('./devices.router')
const {checkErrors} = require("../middlewares/errors.middleware");

router.use('/users',usersRouter);
router.use('/devices',devicesRouter);

router.use(checkErrors)
module.exports = router;