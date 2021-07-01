"use strict";
const router = require("express").Router();
const {authenticate} = require("../app/Middleware");

const controller = require("../app/banks/controller"),
    validator = require("../app/banks/validator");

router.get("/", controller.listBanks);
router.post("/account/resolve", authenticate, validator.resolveAccountNumber, controller.resolveAccountNumber);
router.get("/me", authenticate, controller.fetchUserBanks);

module.exports = router;
