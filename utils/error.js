class AppError extends Error {
    constructor(statusCode, errorCode, err) {
        super();
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.err = err;
    }
}

module.exports = AppError;