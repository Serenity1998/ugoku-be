import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as dotenv from 'dotenv';
import { EmailService } from '../types';
import * as functions from 'firebase-functions';

dotenv.config();

const AWS_ACCESS_KEY_ID = functions.config().aws.access_key_id;
const AWS_SECRET_ACCESS_KEY = functions.config().aws.secret_access_key;
const AWS_REGION = functions.config().aws.region;

// commands
// firebase functions:config:set aws.region="us-east-1"
// firebase functions:config:set aws.access_key_id="your-access-key"
// firebase functions:config:set aws.secret_access_key="your-secret-key"

const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendEmail(data: EmailService) {
  const params = {
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Body: {
        Html: {
          Data: data.html,
        },
      },
      Subject: {
        Data: data.subject,
      },
    },
    Source: 'no-reply@msar-ugoku.com',
  };

  try {
    const result = await sesClient.send(new SendEmailCommand(params));
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
