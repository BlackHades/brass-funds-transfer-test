'use strict';
const Joi = require('@hapi/joi');
global.successResponse = (res, data, code = 200) => {
    if(data &&  data.docs){
        data.data = data.docs;
        delete data.docs;
        return res.status(code).send(data);
    }
    return res.status(code).send({data});
};

global.errorResponse = (res, error = "Oops. An Error Occurred", code = 500) => {
    return res.status(code).send({error: error});
};


/**
 *
 * @param {Object} schema joi schema
 * @param {Object} payload object to be validated
 * @return {string|null}
 */
exports.validate = (schema, payload) => {
    schema = Joi.object(schema);
    const {error, value} = schema.validate(payload, {
        allowUnknown: true,
    });

    if (error)
        return error.details[0].message.replace(/['"]/g, '');

    return null;
};


process.on("uncaughtException", (ex) => {
    console.log(ex.message, ex.stack, {
        error: ex.toString()
    });
    process.exit(0);
});

process.on("uncaughtRejection", (ex) => {
    console.log(ex.message, ex.stack, {
        error: ex.toString()
    });
    process.exit(0);
});


process.on("unhandledRejection", (ex) => {
    console.log(ex.message, ex.stack, {
        error: ex.toString()
    });
    process.exit(0);
});
