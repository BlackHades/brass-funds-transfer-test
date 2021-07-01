"use strict";
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require("moment");


const userRepository = require("../users/repository");
const authService = require("./service");
exports.register = async (req, res) => {

    //hash user password
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //Save user details in the database
    const user = await userRepository.create(req.body);

    //return response with token
    return successResponse(res, {
        user,
        token: await authService.generateToken(user._id)
    }, 201);
};


exports.login = async (req, res) => {

    //compare password
    if (!bcrypt.compareSync(req.body.password, res.user.password))
        return errorResponse(res, "Invalid Credentials", 422);

    //return response with token
    return successResponse(res, {
        user: res.user,
        token: await authService.generateToken(res.user._id)
    });
};

exports.logout = async (req, res) => {
    //get token
    let token = req.headers["authorization"] || req.body;
    if (!token)
        return successResponse(res, "successfully logged out.");


    //Process: we can get token and blacklist here so that it cant be used by anybody anymore
    return successResponse(res, "successfully logged out.");

};


exports.me = async (req, res) => {
    return successResponse(res, res.user);
};

