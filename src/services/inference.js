const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, imageBuffer) {
    try {
        // Preprocess the image
        const tensor = tf.node
            .decodeJpeg(imageBuffer) // Decode the JPEG image
            .resizeBilinear([224, 224]) // Resize to the expected input size
            .expandDims(0) // Add batch dimension
            .toFloat(); // Convert to float

        // Make the prediction
        const prediction = model.predict(tensor);
        const scores = await prediction.data(); // Get the prediction scores
        console.log('Scores:', scores); // Log the score array

        // Define the class labels for tea leaf diseases
        const classLabels = [
            'algal_spot', //#1
            'brown_blight', //#2
            'gray_blight', //#3
            'healthy', //#4
            'helopeltis', //#5
            'red_spot' //#6
        ];

        // Find the index of the highest score
        const maxIndex = scores.indexOf(Math.max(...scores));
        const label = classLabels[maxIndex]; // Get the corresponding label
        const probability = scores[maxIndex]; // Get the probability for the predicted class

        // Initialize suggestion based on the predicted label
        let suggestion;
        switch (label) {
            case 'helopeltis':
                suggestion = "Periksa untuk serangan Helopeltis.";
                break;
            case 'algal_spot':
                suggestion = "Periksa untuk penyakit bercak algal.";
                break;
            case 'brown_blight':
                suggestion = "Periksa untuk penyakit bercak coklat.";
                break;
            case 'healthy':
                suggestion = "Daun teh dalam kondisi baik.";
                break;
            case 'red_spot':
                suggestion = "Periksa untuk penyakit bercak merah.";
                break;
            case 'gray_blight':
                suggestion = "Periksa untuk penyakit bercak abu-abu.";
                break;
            default:
                suggestion = "Kondisi tidak terdeteksi.";
        }

        // Return the results
        return { label, probability, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi: ` + error.message);
    }
}

module.exports = predictClassification;