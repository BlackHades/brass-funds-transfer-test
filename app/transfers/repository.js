"use strict";
const Model = require("./model");
const Repository =  require("../Repository");

class TransferRepository extends Repository {
    constructor(){
        super(Model);
    }
}

module.exports = (new TransferRepository());
