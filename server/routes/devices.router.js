const express = require('express');
const Device = require('../sequelize/models/device');
const devicesRouter = express.Router();

const getDevice = async (req,res,next) => {
    const name = req.params.name;
    const device = await Device.findByPk(name);
    if (!device) {
        return res.status(404).send({ message: 'Device not found', error: `Device "${name}" not found.` });
    }
    req.device = device;
    next();
}

devicesRouter.get('/', async (req, res, next) => {
    try {
        const devices = await Device.findAll();
        res.send(devices);
    } catch (error) {
        next(error);
    }
});

devicesRouter.post('/', async (req, res, next) => {
    try {
        const newDevice = await Device.create(req.body);
        res.status(201).send({ message: `Device "${newDevice.get('name')}" created successfully.`, device:newDevice});
    } catch (error) {
        next(error);
    }
});

devicesRouter.get('/:name', getDevice, async (req, res, next) => {
    try {
        res.send(req.device);
    } catch (error) {
        next(error);
    }
});

devicesRouter.put('/:name', getDevice, async (req, res, next) => {
    try {
        await req.device.update(req.body);
        res.send({ message: `Device "${req.device.name}" updated successfully.`, device:req.device});
    } catch (error) {
        next(error);
    }
});

devicesRouter.delete('/:name', getDevice, async (req, res, next) => {
    try {
        await req.device.destroy();
        res.send({ message: `Device "${req.device.name}" deleted successfully.` });
    } catch (error) {
        next(error);
    }
});

module.exports = devicesRouter;