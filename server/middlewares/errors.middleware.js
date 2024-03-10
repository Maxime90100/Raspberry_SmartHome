const {Sequelize} = require('sequelize');

const checkErrors = (err, req, res, next) => {
    if(!err) next()
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
    return res.status(500).send({
        message: 'Error',
        error: err
    });
};

module.exports = {
    checkErrors
}