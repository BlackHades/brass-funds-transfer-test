"use strict";
const Joi = require("@hapi/joi");


exports.transfer = async (req, res, next) => {
    const schema = {
        bankValidationId: Joi.string().required(),
        amount: Joi.number().required(),
        narration: Joi.string()
    };

    const {error} = Joi.validate(req.body, schema, {
        allowUnknown: true,
        abortEarly: true
    });

    if (error) return errorResponse(res, error.details[0].message.replace(/['"]/g, ''), 422);
    return next();
};

