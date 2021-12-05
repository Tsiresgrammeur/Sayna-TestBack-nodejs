const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const User = require("../models/user.m");

/* Récupération du header bearer */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

verifyToken = (req, res, next) => {
    // let token = req.headers["x-access-token"];
    let token = req.headers.authorization && extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};



const authJwt = {
    verifyToken: verifyToken,
};
module.exports = authJwt;