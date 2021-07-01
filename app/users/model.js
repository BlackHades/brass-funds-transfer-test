"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const schema = mongoose.Schema({
    name: {type: String},
    email: {type: String,  allowNull: false, required: true},
    password: {type: String, required: true},
},{
    toJSON: {
        transform: function(doc, ret) {
            ret.userId = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    },
    strict: false,
    timestamps: true
});

// schema.index({"$**":"text"});
schema.plugin(mongoosePaginate);
module.exports =  mongoose.model("users", schema);
