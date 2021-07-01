"use strict";
require("dotenv").config({});
const express = require('express');

const app = express();

require("./startups")(app, express);
//routes
require("./routes")(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    return res.status(404).json({error: `${req.url} not found`})
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.log(err);
  res.status(err.status || 500);
  res.send({error: err.message});
});

module.exports = app;
