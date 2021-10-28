function Handler(controller) {
    return (req, res, next) => {
        controller(req, res).catch(next);
    }
}

module.exports = Handler;