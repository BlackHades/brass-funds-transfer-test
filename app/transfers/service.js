"use strict";
const paystackService = require("../../services/paystack");

//each function in the service can be tested individually

exports.doTransfer = async (transferId, amount, recipient, narration) => {
    // this function can be easily changed to use to strategy pattern so we can switch from one providers to the other on the fly.
    // but we will stick to one provider for now.
    //check for error and some other processing like data transformation if we are using the strategy pattern
    const {error, data} = await paystackService.initiateTransfer(transferId, amount, recipient, narration || "Brass Transfer");

    return {error, data};
};


exports.resolveAccountNumber = async (bankCode, accountNumber) => {

    //fetch bank list
    const {error: bankListError, data: bankList} = await this.fetchBankList();
    if (bankListError) return {error: bankListError};

    //get actual bank
    const bank = bankList.find(bank => bank.bankCode === bankCode);
    if (!bank) return {error: "Oops! We are unable to get selected bank. Please try again later"};

    //validate account number
    const {error, data} = await paystackService.resolveBank(accountNumber, bankCode);
    if (error) return {error};
    data.bankName = bank.bankName;

    //Because we need to make bank transfer using paystack, we would create a transfer recipient at this point

    //create  transfer recipientt
    const {error: recipientError, data: recipientData} = await paystackService.createTransferRecipient(data);
    if (error) return {error: recipientError};

    return {data: recipientData};
};
