'use strict';
const path = require('path');
const helmet = require("helmet");
const logger = require('morgan');
const cors = require("cors");

module.exports = (app, express) => {
    // view engine setup
    app.use(cors());
    app.use(helmet());
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

};
