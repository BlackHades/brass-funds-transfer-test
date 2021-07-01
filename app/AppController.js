"use strict";
const repository = require("./users/repository");

exports.healthCheck = async (req, res, next) => {
    try{

        //1. Check DB
        const healthCheck = {
            uptime: process.uptime(),
            database: false,
            timestamp: Date.now()
        };

        //DB
        await repository.findOne({});
        healthCheck.database = true;

        return successResponse(res, healthCheck);
    }catch (e) {
        return errorResponse(res, e.message);
    }
};
