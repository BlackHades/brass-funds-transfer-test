"use strict";
const Joi = require("@hapi/joi");
const billingService = require("../../services/BillingService");

exports.create = async (req, res, next) => {
    const schema = {
        clientId: Joi.string().required(),
        label: Joi.string().required(),
        image: Joi.string().uri(),
        minimumStake: Joi.number(),
        maximumStake: Joi.number(),
        winningLedgerId: Joi.string().required(),
        payingLedgerId: Joi.string().required(),
        applicationId: Joi.string().required()
    };


    const {error} = Joi.validate(req.body, schema, {
        allowUnknown: true,
        abortEarly: true
    });

    if (error)
        return errorResponse(res, error.details[0].message.replace(/['"]/g, ''), 422);

    //validate applicationId
    const applicationResponse = await billingService.findApplication(req.body.clientId, req.body.applicationId);
    if(applicationResponse.error)
        return errorResponse(res, "Selected Application is invalid", 422);



    //validate payingLedgerId

    const payingLedgerResponse = await billingService.findLedger(req.body.clientId, req.body.payingLedgerId);
    if(payingLedgerResponse.error)
        return errorResponse(res, "Paying Ledger is invalid", 422);

    if( req.body.winningLedgerId != req.body.payingLedgerId){
        //validate winningLedgerId
        const winningLedgerResponse = await billingService.findLedger(req.body.clientId, req.body.winningLedgerId);
        if(winningLedgerResponse.error)
            return errorResponse(res, "Winning Ledger is invalid", 422);

    }


    return next();
};

exports.update = async (req, res, next) => {
    const schema = {
        label: Joi.string(),
        image: Joi.string(),
        minimumStake: Joi.number(),
        maximumStake: Joi.number(),
        winningLedgerId: Joi.string(),
        payingLedgerId: Joi.string(),
        applicationId: Joi.string()
    };

    const {error} = Joi.validate(req.body, schema, {
        allowUnknown: true,
        abortEarly: true
    });

    if (error)
        return errorResponse(res, error.details[0].message.replace(/['"]/g, ''), 422);

    //validate applicationId
    const applicationResponse = await billingService.findApplication(req.body.clientId, req.body.applicationId);
    if(applicationResponse.error)
        return errorResponse(res, "Selected Application is invalid", 422);

    //validate payingLedgerId
    const payingLedgerResponse = await billingService.findLedger(req.body.clientId, req.body.payingLedgerId);
    if(payingLedgerResponse.error)
        return errorResponse(res, "Paying Ledger is invalid", 422);

    if( req.body.winningLedgerId != req.body.payingLedgerId){
        //validate winningLedgerId
        const winningLedgerResponse = await billingService.findLedger(req.body.clientId, req.body.winningLedgerId);
        if(winningLedgerResponse.error)
            return errorResponse(res, "Winning Ledger is invalid", 422);

    }


    return next();
};

