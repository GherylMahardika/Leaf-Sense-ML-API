const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'leaf-sense-storage'; // Replace with your bucket name

async function uploadFile(buffer, destination) {
    const fullDestination = `prediction-image/${destination}`; // Add the folder path
    const file = storage.bucket(bucketName).file(fullDestination);

    // Create a write stream to upload the buffer
    const stream = file.createWriteStream({
        metadata: {
            contentType: 'image/jpeg', // Adjust based on your image type
        },
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('finish', () => {
            console.log(`Buffer uploaded to ${bucketName}/${fullDestination}`);
            resolve();
        });
        stream.end(buffer); // End the stream with the buffer
    });
}

module.exports = { uploadFile };