const predictClassification = require('../services/inference');
const fs = require('fs');
const crypto = require('crypto');
const { uploadFile } = require('../services/storage'); // Import the upload function
const { connectToDatabase } = require('../services/database'); // Import the database connection function

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

        // Generate a unique ID
        const id = crypto.randomUUID();

        // Define the destination path in Cloud Storage
        const imageUrl = `${id}-${imageFile.originalname}`; // Define the path in Cloud Storage

        // Upload the image to Cloud Storage using the buffer
        await uploadFile(imageFile.buffer, imageUrl); // Pass the buffer instead of path

        // Save the result in the database (only id, result, and image_url)
        const connection = await connectToDatabase();
        await connection.execute('INSERT INTO predictions (id, result, image_url, probability) VALUES (?, ?, ?, ?)', [
            id,
            label,
            `https://storage.googleapis.com/leaf-sense-storage/prediction-image/${imageUrl}`, // Construct the public URL
            probability // Include probability in the SQL insert
        ]);

        // Prepare the response message
        const responseMessage = 'Model predicted successfully';

        const response = {
            status: 'success',
            message: responseMessage,
            data: {
                id: id,
                result: label,
                probability: probability, // Include probability in the response
                description: description, // Include description in the response
                prevention: prevention, // Include prevention in the response
                cure: cure // Include cure in the response
            }
        };

        return res.status(201).json(response);
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