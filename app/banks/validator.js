"use strict";
const Joi = require("@hapi/joi");


exports.resolveAccountNumber = async (req, res, next) => {
    const schema = {
        accountNumber: Joi.string().required().label("Account number"),
        bankCode: Joi.string().required().label("Bank code")
    };

    const {error} = Joi.validate(req.body, schema, {
        allowUnknown: true,
        abortEarly: true
    });

    if (error) return errorResponse(res, error.details[0].message.replace(/['"]/g, ''), 422);
    return next();
};

