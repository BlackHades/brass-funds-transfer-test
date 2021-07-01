"use strict";
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userId: {type: String, required: true},
    bankName: {type: String, required: true},
    accountName: {type: String, required: true},
    accountNumber: {type: String, required: true},
    bankCode: {type: String, required: true},
    recipientCode: {type: String, required: true}
},{
    toJSON: {
        transform: function(doc, ret) {
            ret.validationId = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    strict: false,
    timestamps: true
});

module.exports =  mongoose.model("bank-account-validations", schema);
