const express = require('express');
const { postPredictHandler } = require('./handler');

const router = express.Router();

module.exports = (upload, model) => {
    router.post('/predict', upload.single('image'), (req, res, next) => postPredictHandler(req, res, next, model));
    // router.get('/predict/histories', predictHistoriesHandler);
    return router;
};