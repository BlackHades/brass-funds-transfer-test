"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const {STATUS} = require("../Constants");

const schema = mongoose.Schema({
    userId: {type: String, required: true},
    amount: {type: Number, required: true},
    bankValidationId: {type: String, required: true},
    bankName: {type: String, required: true},
    accountName: {type: String, required: true},
    accountNumber: {type: String, required: true},
    bankCode: {type: String, required: true},
    narration: {type: String},
    status: {type: String, default: STATUS.PENDING},
    error: {type: String},
    providersResponse: {type: Object},
    meta: {type: Object}
},{
    toJSON: {
        transform: function(doc, ret) {
            ret.transferId = ret._id;
            delete ret.providersResponse;
            delete ret.meta;
            delete ret._id;
            delete ret.__v;
        }
    },
    strict: false,
    timestamps: true
});

schema.index({ "$**": "text" });
schema.plugin(mongoosePaginate);
module.exports =  mongoose.model("transfers", schema);
