const express = require('express');
const User = require('../sequelize/models/user');
const usersRouter = express.Router();

const getUser = async (req,res,next) => {
    const username = req.params.username;
    const user = await User.findByPk(username);
    if (!user) {
        return res.status(404).send({ message: 'User not found', error: `User "${username}" not found.` });
    }
    req.user = user;
    next();
}

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

usersRouter.get('/:username', getUser, async (req, res, next) => {
    try {
        res.send(req.user);
    } catch (error) {
        next(error);
    }
});

usersRouter.put('/:username', getUser, async (req, res, next) => {
    try {
        await req.user.update(req.body);
        res.send({ message: `User "${req.user.username}" updated successfully.`, user:req.user});
    } catch (error) {
        next(error);
    }
});

usersRouter.delete('/:username', getUser, async (req, res, next) => {
    try {
        await req.user.destroy();
        res.send({ message: `User "${req.user.username}" deleted successfully.` });
    } catch (error) {
        next(error);
    }
});

module.exports = usersRouter;