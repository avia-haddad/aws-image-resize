# AWS Serverless Image Uploader and Resizer

This project is designed to upload images to an AWS S3 bucket, publish an SQS message, and then use a Lambda function to listen for the SQS event, resize the image, and save it to a new S3 bucket.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- AWS Account
- Node.js
- Python

### Development

1. Clone the repository to your local machine.
2. Install the dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in the necessary values.
4. Run with `npm start`.

## Usage

Upload an image to the specified S3 bucket. This will trigger the SQS message and the Lambda function, which will resize the image and save it to a new bucket.

## Built With

- Node.js - The runtime used
- AWS SDK for JavaScript - AWS Service
- Python - Image resizing lambda function
