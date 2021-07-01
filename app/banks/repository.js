"use strict";
const Model = require("./model");
const Repository =  require("../Repository");

class BankRepository extends Repository {
    constructor(){
        super(Model);
    }
}

module.exports = (new BankRepository());
