const predictClassification = require('../services/inference');
// const storeData = require('../services/storeData');
// const getAllData = require('../services/getPredictionData');
const crypto = require('crypto');
const fs = require('fs');

async function postPredictHandler(req, res, next, model) {
    const imageFile = req.file; // Access the uploaded file

    // Log the file object to debug
    console.log('Uploaded file:', imageFile);

    if (!imageFile) {
        return res.status(400).json({
            status: 'fail',
            message: 'No image file uploaded.',
        });
    }

    try {
        // Get prediction details
        const { label, probability, description, prevention, cure } = await predictClassification(model, imageFile.buffer); // Pass the buffer to predictClassification

        // Check if label is defined
        if (label === undefined) {
            throw new Error('Prediction label is undefined.');
        }

        // Generate a unique ID and the current timestamp
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Prepare the data object with all relevant properties
        const data = {
            id: id,
            result: label,
            probability: probability,
            description: description,
            prevention: prevention,
            cure: cure,
            createdAt: createdAt
        };

        // Prepare the response message
        const responseMessage = 'Model predicted successfully';

        const response = {
            status: 'success',
            message: responseMessage,
            data: data
        };

        // Uncomment if you want to store data
        // await storeData(id, data);

        return res.status(200).json(response);
    } catch (error) {
        // Handle any errors during prediction
        return res.status(400).json({
            status: 'fail',
            message: `Error during prediction: ${error.message}`,
        });
    }
}

// async function predictHistoriesHandler(req, res) {
//     const allData = await getAllData();

//     const formatAllData = allData.map(doc => {
//         const data = doc.data();
//         return {
//             id: doc.id,
//             history: {
//                 result: data.result,
//                 createdAt: data.createdAt,
//                 suggestion: data.suggestion,
//                 id: doc.id
//             }
//         };
//     });

//     const response = {
//         status: 'success',
//         data: formatAllData
//     };

//     return res.status(200).json(response);
// }

// module.exports = { postPredictHandler, predictHistoriesHandler };
module.exports = { postPredictHandler };