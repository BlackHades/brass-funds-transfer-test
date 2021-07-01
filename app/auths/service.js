"use strict";
const jwt = require('jsonwebtoken');

exports.generateToken = async (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECURITY_KEY, {expiresIn: '1h'})
};
