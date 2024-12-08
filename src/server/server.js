const express = require('express');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0'; // Default to 0.0.0.0

// Middleware for parsing multipart/form-data
const upload = multer({ limits: { fileSize: 1000000 } }); // Set max file size to 1MB

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Load model
loadModel().then(model => {
    app.locals.model = model;

    // Register routes
    app.use(routes(upload, app.locals.model)); // Pass upload and model to routes

    // Error handling middleware
    app.use((err, req, res, next) => {
        if (err instanceof InputError) {
            return res.status(err.statusCode).json({
                status: 'fail',
                message: err.message
            });
        }

        if (err.isBoom) {
            return res.status(err.output.statusCode).json({
                status: 'fail',
                message: err.message
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server started at: http://${HOST}:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to load model:', err);
});