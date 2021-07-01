"use strict";
const jwt = require('jsonwebtoken');

const userRepository = require("./users/repository");

exports.authenticate = async (req, res, next) => {
    try {
        //check if auth token is present
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        if (!token) throw new Error("No token provided.");

        if (token.startsWith('Bearer ')) token = token.slice(7, token.length);

        const decodedToken = await jwt.decode(token, process.env.JWT_SECURITY_KEY);
        if (!decodedToken) throw new Error("Failed to authenticate token. ");

        res.user = await userRepository.findById(decodedToken.userId);
        if (!res.user) return errorResponse(res, "Failed to authenticate token", 401);
        return next();
    } catch (e) {
        console.log(e);
        return errorResponse(res, "Failed to authenticate token", 401);
    }
};
