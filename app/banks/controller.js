"use strict";

const bankService = require("./service");
const bankRepository = require("./repository");

exports.listBanks = async (req, res) => {
    const {error, data} = await bankService.fetchBankList();

    if(error) return errorResponse(res, error, 500);

    return successResponse(res, data);
};

exports.resolveAccountNumber = async (req, res) => {
    let bankValidation = await bankRepository.findOne({
        userId: res.user._id,
        accountNumber: req.body.accountNumber,
        bankCode: req.body.bankCode
    });

    console.log("bankValidation",bankValidation);
    if(bankValidation) return successResponse(res, bankValidation);
    const {error, data} = await bankService.resolveAccountNumber(req.body.bankCode, req.body.accountNumber);
    console.log("resolveAccountNumber", error, data);
    if(error) return errorResponse(res, "Oops! We are unable to verify this account number at this moment, Please try again later", 500);

    data.userId = res.user._id;
    bankValidation = await bankRepository.create(data);
    return successResponse(res, bankValidation);
};

exports.fetchUserBanks = async (req, res) => {

    let userBanks = await bankRepository.all({
        ...req.query,
        userId: res.user._id,
    });
    return successResponse(res, userBanks);
};
