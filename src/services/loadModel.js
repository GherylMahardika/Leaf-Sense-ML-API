const tf = require('@tensorflow/tfjs-node');

// Define the L2 class
class L2 {
    static className = 'L2';

    constructor(config) {
        return tf.regularizers.l1l2({ l1: 0, l2: config.l2 });
    }
}

// Register the L2 class
tf.serialization.registerClass(L2);

async function loadModel() {
    try {
        const model = await tf.loadLayersModel('https://storage.googleapis.com/leaf-sense-storage/model/model.json');
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Failed to load model:', error);
        throw error;
    }
}
module.exports = loadModel;