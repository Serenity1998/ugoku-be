import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../common/utils/envSetting';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

export const generateFileName = async (fileName: string, productId: string) => {
  const date = new Date();
  // const formattedDate = date.toISOString(); // Format date as YYYY-MM-DD
  return `product-${productId}/${fileName}`;
};

export const generateUploadUrl = async (bucketName: string, key: string, expiresIn: number) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresIn,
    ContentType: 'application/octet-stream',
  };
  return s3.getSignedUrlPromise('putObject', params);
};

export const generateDownloadUrl = async (bucketName: string, key: string, expiresIn: number) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresIn,
  };
  return s3.getSignedUrlPromise('getObject', params);
};

export const getPlainUrl = async (bucketName: string, key: string) => {
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<AWS.S3.ManagedUpload.SendData> => {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `uploads/${uuidv4()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  return s3.upload(params).promise();
};
