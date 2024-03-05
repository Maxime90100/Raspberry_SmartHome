const express = require('express');
const User = require('../models/user');
const {sequelizeErrorMiddleware} = require("../middlewares/sequelize.middleware");

const usersRouter = express.Router();

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.send(users);
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/', async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).send({ message: `User "${newUser.get('username')}" created successfully.`, user:newUser});
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).send({ message: 'User not found', error: `User "${username}" not found.` });
        }
        res.send(user);
    } catch (error) {
        next(error);
    }
});

usersRouter.put('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).send({ message: 'User not found', error: `User "${username}" not found.` });
        }
        await user.update(req.body);
        res.send({ message: `User "${username}" updated successfully.`, user:user});
    } catch (error) {
        next(error);
    }
});

usersRouter.delete('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).send({ message: 'User not found', error: `User "${username}" not found.` });
        }
        await user.destroy();
        res.send({ message: `User "${username}" deleted successfully.` });
    } catch (error) {
        next(error);
    }
});

usersRouter.use(sequelizeErrorMiddleware);

module.exports = usersRouter;