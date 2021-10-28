const jwt = require('jsonwebtoken');

const authenticate = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).redirect('/user/login');

        jwt.verify(token, process.env.TOKEN, (err, decoded) => {
            if (err) {
                if (process.env.NODE_ENV != 'production') console.log(err);
                return res.sendStatus(403).redirect('/user/login');
            }
            let roles = ['admin', ...allowedRoles];
            if (roles.includes(decoded.role)) {
                req.user = { id: decoded.userId, role: decoded.role };
                next();
            } else {
                return res.sendStatus(403).redirect('/user/login');
            }
        });
    }
}

class Auth {
    static admin = () => authenticate([]);

    static user = () => authenticate(['user']);

    static auth = () => {
        return (req, res, next) => {
            const token = req.cookies.token;
            if (!token) next();
            else {
                jwt.verify(token, process.env.TOKEN, (err, decoded) => {
                    if (err) next();
                    else {
                        req.user = { id: decoded.userId, role: decoded.role };
                        next();
                    }
                });
            }
        }
    }
}

module.exports = Auth;