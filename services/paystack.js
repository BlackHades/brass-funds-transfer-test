"use strict";
const axios = require('axios').create({
    baseURL: "https://api.paystack.co",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
    }
});

module.exports = {
    listBanks: async () => {
        try {
            // a cache layer can be added here for optimization as the data does not change often
            console.log("========== Fetching From API Source ===============");
            const resp = await axios.get("/bank");
            // console.log(resp.data);
            let bankList =resp?.data?.data.map(bank => {
                return {
                    bankName: bank.name,
                    bankCode: bank.code
                }
            });
            // console.log(arr);
            return {data: bankList};
        } catch (err) {
            //log error to a log collector
            console.log("Error", err);
            return {error: err?.response?.data?.message || err.message};
        }
    },
    resolveBank: async (accountNumber, bankCode) => {
        try {
            const resp = await axios.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
            console.log(resp.data);
            if (!resp.data.status)
                return {error: resp?.data?.message || "Oops! We were not able to verify this account number. Please try again"};


            console.log("here", resp.data.data.account_name);

            return {
                data: {
                    accountName: resp.data.data.account_name,
                    accountNumber:resp.data.data.account_number,
                    bankCode: bankCode
                }
            }

        } catch (err) {
            console.log(err);
            return {error: err?.response?.data?.message || err.message};
        }

    },
    createTransferRecipient: async (account) => {
        try {
            const resp = await axios.post("/transferrecipient?", {
                type: "nuban",
                name: account.accountName,
                account_number:  account.accountNumber,
                bank_code: account.bankCode,
                currency: "NGN"
            });
            if (!resp.data.status)
                return {error: resp?.data?.message || "Oops! We were not able to verify this account number. Please try again"};
            return {
                data: {
                    ...account,
                    recipientCode: resp.data.data.recipient_code,
                }
            }

        } catch (err) {
            console.log(err);
            return {error: err?.response?.data?.message || err.message};
        }

    },
    initiateTransfer: async (reference, amount, recipient, narration) => {
        try {



            //
            // const resp = await axios.post("/transfer", {
            //     source: "balance",
            //     amount: amount,
            //     reference: reference,
            //     recipient: recipient,
            //     reason: narration,
            // });
            // if (!resp.data.status)
            //     return {error: resp?.data?.message || "Oops! We were not able to verify this account number. Please try again"};


            //MOCKING PAYSTACJ RESPONSE BECAUSE PAYSTACK WAS RETURNING AN ERROR ""

            const response =  {
                "reference": reference,
                "integration": 428626,
                "domain": "test",
                "amount": amount,
                "currency": "NGN",
                "source": "balance",
                "reason": "Holiday Flexing",
                "recipient": 6788170,
                "status": "pending",
                "transfer_code": "TRF_fiyxvgkh71e717b",
                "id": 23070321,
                "createdAt": "2020-05-13T14:22:49.687Z",
                "updatedAt": "2020-05-13T14:22:49.687Z"
            };
            return {
                // data: resp.data.data
                data: response
            }

        } catch (err) {
            console.log(err);
            return {error: err?.response?.data?.message || err.message};
        }

    }

};
