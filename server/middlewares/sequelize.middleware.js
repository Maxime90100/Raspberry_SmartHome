const {Sequelize} = require('sequelize');

const checkSequelizeErrors = (err, req, res, next) => {
    if (err instanceof Sequelize.UniqueConstraintError) {
        return res.status(409).send({
            message: 'Unique Constraint Conflict',
            error: [err.parent.detail]
        });
    } else if (err instanceof Sequelize.ValidationError) {
        return res.status(400).send({
            message: 'Validation Error',
            error: err.errors.map(error => error.message)
        });
    }
    next({ message: 'Internal Server Error', error: err});
};

module.exports = {
    checkSequelizeErrors
}