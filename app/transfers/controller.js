"use strict";

const bankRepository = require("../banks/repository");
const transferRepository = require("./repository");

const transferService = require("./service");
const {STATUS} = require("../Constants");

exports.history = async (req, res) => {
    const {page = 1, limit = 50, query, ...filter} = req.query;
    if(query) filter.$text =  { $search: query };


    filter.userId = res.user._id;

    const transfers = await transferRepository.all(filter, {_id: -1}, page, limit);
    //transfer is still pending at this point. We wait for paystack webhook call.
    return successResponse(res, transfers);
};

exports.transfer = async (req, res) => {
    const account = await bankRepository.findById(req.body.bankValidationId);
    if (!account) return errorResponse(res, "Selected account not found.", 404);
    //here we assume user has enough money in their wallet as a use case, so we continue with the transfer
    let transfer = await transferRepository.create({
        bankValidationId: req.body.bankValidationId,
        accountName: account.accountName,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        bankCode: account.bankCode,
        narration: req.body.narration,
        userId: res.user._id,
        amount: req.body.amount,
    });

    const {error, data} = await transferService.doTransfer(transfer._id.toString(), transfer.amount, account.recipientCode, req.body.narration);
    transfer.providersResponse = data;
    if(error){
        transfer.status = STATUS.FAILED;
        transfer.error = error;
        await transfer.save();
        //Spool event for other listeners like email worker, sms worker and so on to do their job
        return errorResponse(res, error);
    }
    transfer =  await transfer.save();
    //transfer is still pending at this point. We wait for paystack webhook call.
    return successResponse(res, transfer, 202);
};

exports.resolveCallback = async (req, res) => {
    const  payload = {...req.query,...req.params, ...req.body};
    const acceptedEvents = ["transfer.success","transfer.success"];
    if(!acceptedEvents.includes(payload.event))
        return successResponse(res, "Unsupported event");

    const reference = payload.data.reference;
    const transfer = await transferRepository.findById(reference);
    if(!transfer) return successResponse(res, "Transfer Not Found");
    if(transfer.status != STATUS.PENDING)
        return successResponse(res, "Transfer has been resolved earlier");

    transfer.meta = {
        ...transfer.meta,
        webhookPayload: payload
    };
    if(payload.data.status == "failed"){
        transfer.status = STATUS.FAILED;
        transfer.error = error;
        await transfer.save();
        //Spool event for other listeners like email worker, sms worker and so on to do their job
    }
    transfer.status = STATUS.SUCCESS;
    await transfer.save();
    //Spool event for other listeners like email worker, sms worker and so on to do their job
    return successResponse(res, transfer);
};
