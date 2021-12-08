const AppError = require('../utils/error');

const handleError = (err, req, res, next) => {
    if (process.env.NODE_ENV != 'production') console.log(err);
    console.log(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ code: err.errorCode, message: err.message || 'error' });
    }
    return res.status(500).json({ code: 'internal-server-error' });
}

module.exports = handleError;