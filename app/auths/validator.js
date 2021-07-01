"use strict";
const Joi = require('@hapi/joi');


const userRepository = require("../users/repository");
const { validate } = require("../helper");


exports.register = async(req, res, next) => {
    const schema = {
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
        name: Joi.string()
    };

    const error = validate(schema, req.body);
    if (error) return errorResponse(res, error, 422);

    //validate if user hasn't been used to register before
    const checkIfUserWithSameEmailExists = await userRepository.findOne({email: req.body.email});

    if (checkIfUserWithSameEmailExists) return errorResponse(res, "Oops! Email has been taken", 409);

    return next();
};

exports.login = async(req, res, next) => {
    const schema = {
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    };

    const error = validate(schema, req.body);
    if (error) return errorResponse(res, error, 422);

    //validate if user hasn't been used to register before
    res.user = await userRepository.findOne( { email: req.body.email } );
    if (!res.user) return errorResponse(res, "Invalid Credentials", 422);

    return next();
};
