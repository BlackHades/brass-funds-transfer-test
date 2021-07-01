"use strict";

require("../app/helper");

require("./database");

module.exports = (app, express) => {
    //middleware
    require("./middleware")(app, express);
};
