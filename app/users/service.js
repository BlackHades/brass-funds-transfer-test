"use strict";
const predictionRepository = require("../banks/PredictionRepository");
const userPredictionRepository = require("../user-predictions/UserPredictionRepository");
const userPredictionTransactionRepository = require("../user-prediction-transactions/UserPredictionTransactionRepository");

exports.onUpdate = async (payload) => {
    console.log("Payload", payload);
    const collection = payload.data;
    if(!collection)  return {data: true};

    //update prediction
    let updateResponse = await predictionRepository.updateMany({collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            minimumStake: collection.minimumStake,
            maximumStake: collection.maximumStake,
            status: collection.status
        }
    });

    console.log("Prediction Update", updateResponse);

    //update user-prediction-transaction

    updateResponse = await userPredictionTransactionRepository.updateMany({clientId: payload.clientId, collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            status: collection.status
        }
    });

    console.log("User Prediction Transaction Update", updateResponse);
    //update user prediction

    updateResponse = await userPredictionRepository.updateMany({clientId: payload.clientId, collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            status: collection.status
        }
    });

    console.log("User Prediction Transaction Update", updateResponse);

    return {data: updateResponse};
};

exports.onClose = async (payload) => {
    console.log("Payload", payload);
    const collection = payload.data;
    if(!collection)  return {data: true};

    //update prediction
    let updateResponse = await predictionRepository.updateMany({collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            minimumStake: collection.minimumStake,
            maximumStake: collection.maximumStake,
            status: collection.status
        },
        status: collection.status
    });

    console.log("Prediction Update", updateResponse);

    //update user-prediction-transaction

    updateResponse = await userPredictionTransactionRepository.updateMany({clientId: payload.clientId, collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            status: collection.status
        }
    });

    console.log("User Prediction Transaction Update", updateResponse);
    //update user prediction

    updateResponse = await userPredictionRepository.updateMany({clientId: payload.clientId, collectionId: collection.collectionId}, {
        predictionCollection: {
            label: collection.label,
            image: collection.image,
            status: collection.status
        }
    });

    console.log("User Prediction Transaction Update", updateResponse);

    return {data: updateResponse};
};
