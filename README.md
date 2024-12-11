# Tea Plant Disease Detection API

This API provides a service for detecting diseases in tea plants using image classification. It utilizes a machine learning model to analyze images of tea leaves and return predictions regarding their health status.

## Features

- Upload images of tea leaves for disease detection.
- Get detailed information about detected diseases, including descriptions, prevention methods, and cures.
- Handle various image formats (JPEG and PNG).
- Return responses based on the confidence level of predictions.

## Getting Started

### Prerequisites

- Node.js (version 18 is recommended)
- npm (Node Package Manager)
- A machine learning model for tea plant disease classification
- A cloud storage service (e.g., Google Cloud Storage) for image uploads
- A database (e.g., MySQL) for storing predictions

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GherylMahardika/Leaf-Sense-ML-API.git
   cd tea-plant-disease-detection-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the necessary configuration variables, such as database connection details and cloud storage credentials.

4. Start the server:

   ```bash
   npm run start
   ```

## API Endpoints

### `POST /predict`

This endpoint allows you to upload an image of a tea leaf for disease prediction.

#### Request

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: The image file (JPEG or PNG) of the tea leaf.

#### Response

- **Success (201)**: When the prediction probability is 0.99 or higher.

  ```json
  {
      "status": "success",
      "message": "Model predicted successfully",
      "data": {
          "id": "unique-id",
          "result": "Disease label",
          "probability": 0.99,
          "description": "Description of the disease.",
          "prevention": "Prevention methods.",
          "cure": "Cure methods."
      }
  }
  ```

- **Success (200)**: When the prediction probability is below 0.99.

  ```json
  {
      "status": "success",
      "message": "Model predicted successfully",
      "data": {
          "id": "unique-id",
          "result": "Tidak terdeteksi",
          "probability": 0.85,
          "description": "Mohon foto tanaman teh kembali.",
          "prevention": "Silakan coba lagi dengan foto yang lebih jelas.",
          "cure": "Tidak ada pengobatan yang diperlukan saat ini."
      }
  }
  ```

- **Failure (400)**: For errors such as missing file or unsupported format.

  ```json
  {
      "status": "fail",
      "message": "Error message detailing the issue."
  }
  ```

#### Example Request

```bash
curl -X POST http://localhost:3000/predict \
  -F "file=@path/to/your/image.jpg"
```

## Error Handling

The API provides error responses with appropriate status codes and messages. Common error responses include:

- **400 Bad Request**: When the uploaded file is missing or in an unsupported format.
- **500 Internal Server Error**: For unexpected errors during processing.

## Acknowledgments

- **TensorFlow.js** for machine learning capabilities.
- **Sharp** for image processing.
- **Express** for building the API.
- **MySQL** for database management.
- **Google Cloud Storage** for image storage.
