"use strict";
const uuid = require("uuid/v4");
const moment = require("moment");

const collectionRepository = require("./CollectionRepository");
const productService = require("../../services/ProductService");

const {EVENTS, EXCHANGES, QUEUE, STATUS} = require("../Constants");
exports.create = async (req, res) => {

    const {error: productError, data: product} = await productService.create(req.body.clientId, {
        name: req.body.label + "-" + uuid(),
        type: "prediction",
        description: req.body.label,
        amount: 0
    });
    console.log("Product", productError, product);
    if (productError)
        return errorResponse(res, "A product error occurred", 500);
    req.body.productId = product.id;
    const collection = await collectionRepository.create(req.body);
    //spool to exchange
    await broker.publish(EXCHANGES.PREDICTION_DEFAULT, "",{
        clientId: collection.clientId,
        event: EVENTS.COLLECTION_CREATED,
        data: collection.toJSON()
    });
    return successResponse(res, collection, 201);
};

exports.fetch = async (req, res) => {
    const {page = 1, limit = 50, sort, ...query} = req.query;
    const collections = await collectionRepository.all(query, {_id: -1}, page, limit);
    return successResponse(res, collections);
};

exports.find = async (req, res) => {
    let collection = await collectionRepository.findById(req.params.collectionId);
    if (!collection)
        return errorResponse(res, "Selected Collection can not be found. Please try again", 404);

    collection = collection.toJSON();
    collection.predictionsCount = 0;
    return successResponse(res, collection);
};

exports.update = async (req, res) => {
    delete req.body.clientId;

    await collectionRepository.updateMany({_id: req.params.collectionId, clientId: res.clientId}, req.body);
    let collection = await collectionRepository.findById(req.params.collectionId);
    console.log("Collections", collection);
    if (collection) {
        const queueResponse = await broker.queue(QUEUE.PREDICTION_DEFAULT, {
            clientId: collection.clientId,
            event: EVENTS.COLLECTION_UPDATED,
            data: collection.toJSON()
        }, {persistent: true});
        console.log("Spooled collection.update", queueResponse);
    }
    return successResponse(res, req.params.collectionId, 202)
};

exports.delete = async (req, res) => {
    await collectionRepository.updateMany({
        clientId: req.query.clientId,
        _id: req.params.collectionId
    }, {deletedAt: moment().format("X")});
    return successResponse(res, req.params.collectionId, 202)
};

exports.close = async (req, res) => {

    let collection = await collectionRepository.findOne({clientId: req.query.clientId, _id: req.params.collectionId});
    if (!collection)
        return errorResponse(res, "Oops! We are unable to find selected prediction collection, Please try again later", 404);

    if (collection.status === STATUS.CLOSED)
        return errorResponse(res, `Oops! This prediction collection was closed at ${moment.unix(collection.closedAt).format("LLLL")}`, 400);

    collection.status = STATUS.CLOSED;
    collection.closedAt = moment().format("X");
    collection = await collection.save();

    //spool to exchange
    await broker.publish(EXCHANGES.PREDICTION_DEFAULT, "",{
        clientId: collection.clientId,
        event: EVENTS.COLLECTION_CLOSED,
        data: collection.toJSON()
    });

    //spool to queue
    await broker.queue(QUEUE.PREDICTION_DEFAULT, {
        clientId: collection.clientId,
        event: EVENTS.COLLECTION_CLOSED,
        data: collection.toJSON()
    }, {persistent: true});


    return successResponse(res, req.params.collectionId, 202)
};
