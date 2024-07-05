from io import BytesIO

import boto3
from PIL import Image


def lambda_handler(event, context):
    # Initialize S3 client
    s3 = boto3.client("s3")

    # Parse the event
    record = event["Records"][0]
    body = record["body"]
    bucket_name = body["bucket"]
    key = body["key"]

    try:
        # Download the image file from S3
        response = s3.get_object(Bucket=bucket_name, Key=key)
        image_content = response["Body"].read()

        # Open the image
        with Image.open(BytesIO(image_content)) as img:
            # Resize the image to a square
            size = (256, 256)
            img_resized = img.resize(size, Image.LANCZOS)

            # Save the resized image to memory
            buffer = BytesIO()
            img_resized.save(buffer, format="JPEG")
            buffer.seek(0)

            # Upload the resized image back to S3
            resized_bucket = "after-processor"
            resized_key = f"resized/{key}"
            s3.put_object(Body=buffer, Bucket=resized_bucket, Key=resized_key)

        return {"statusCode": 200, "body": "Image resized and uploaded successfully"}
    except Exception as e:
        print(e)
        return {"statusCode": 500, "body": str(e)}
