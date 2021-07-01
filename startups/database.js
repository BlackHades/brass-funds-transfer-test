'use strict';
const mongoose = require("mongoose");
const debug = require("debug")("app:debug");
mongoose.set('debug', true);

const mongodbUrl = `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}?retryWrites=true`;
console.log("MONGO_DB_FULL_URL", mongodbUrl);
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("connected", () => {
    debug("mongodb connected");
});
db.on('error', (error) => {
    debug("An error occurred", JSON.stringify(error));
    console.log(error.message);
    process.exit(0);
});
