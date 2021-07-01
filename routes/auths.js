"use strict";
const router = require("express").Router();
const {authenticate} = require("../app/Middleware");

const controller = require("../app/auths/controller"),
    validator = require("../app/auths/validator");

router.post("/login", validator.login, controller.login);
router.delete("/logout", controller.logout);


router.get("/me", authenticate, controller.me);


// router.use(authenticate);
//
//
// router.route("/:collectionId")
//     .get(controller.find)
//     .put(validator.update, controller.update);
//
// router.route("/:collectionId/close")
//     .put(controller.close)
//     .delete(controller.close);
//
//
module.exports = router;
