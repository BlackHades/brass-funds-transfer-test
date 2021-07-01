"use strict";
const router = require("express").Router();
const {authenticate} = require("../app/Middleware");

const controller = require("../app/transfers/controller"),
    validator = require("../app/transfers/validator");

router.get("/", authenticate, controller.history);
router.post("/", authenticate, validator.transfer, controller.transfer);
router.all("/paystack/callback", controller.resolveCallback);

// router.get("/", controller.listBanks);

// router.post("/account/resolve", authenticate, validator.resolveAccountNumber, controller.resolveAccountNumber);
// router.get("/me", authenticate, controller.fetchUserBanks);

module.exports = router;
