require("dotenv").config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const fs = require("fs");

// Initialize the S3 client using environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize the SQS client using environment variables
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// upload a file
async function uploadToS3(bucketName, key, fileContent) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: "image/jpeg",
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(`File uploaded successfully: ${data.ETag}`);

    // Send a message to SQS after successful upload
    await sendMessageToSQS("File uploaded", bucketName, key);
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
  }
}

// Function to send a message to SQS
async function sendMessageToSQS(messageBody, bucketName, key) {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL, // SQS queue URL from environment variables
    MessageBody: JSON.stringify({
      message: messageBody,
      bucket: bucketName,
      key: key,
    }),
  };

  try {
    const command = new SendMessageCommand(params);
    const data = await sqsClient.send(command);
    console.log(`Message sent to SQS: ${data.MessageId}`);
  } catch (error) {
    console.error(`Error sending message to SQS: ${error.message}`);
  }
}

if (process.argv.length < 5) {
  console.error("Error: Please provide the bucket name, key, and file path as command-line arguments.");
  process.exit(1);
}

const bucketName = process.argv[2];
const key = process.argv[3];
const filePath = process.argv[4];

console.log(`Reading file from path: ${filePath}`);

if (fs.statSync(filePath).isDirectory()) {
  console.error("Error: The specified path is a directory, not a file.");
  process.exit(1);
}

const fileContent = fs.readFileSync(filePath);

uploadToS3(bucketName, key, fileContent);
