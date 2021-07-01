"use strict";
const Model = require("./model");
const Repository =  require("../Repository");

class UserRepository extends Repository {
    constructor(){
        super(Model);
    }
}

module.exports = (new UserRepository());
