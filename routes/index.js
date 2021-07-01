'use strict';
module.exports = (app) => {
  // app.all("/health-check", require("../app/AppController").healthCheck);

  app.post("/v1/register", require("../app/auths/validator").register, require("../app/auths/controller").register);
  app.use("/v1/auths", require("./auths"));
  app.use("/v1/banks", require("./banks"));
  app.use("/v1/transfers", require("./transfers"));
};
