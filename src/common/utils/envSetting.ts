import dotenv from 'dotenv';
import { cleanEnv, host, port, str, testOnly, url } from 'envalid';

//config function makes environment variables available throughout an application
dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:5173') }),
  CORS_ORIGIN_STUDIO: str({ devDefault: testOnly('http://localhost:5173') }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(8080) }),
  DB_CONNECTION_URL: str({ desc: 'The MongoDB connection URI' }),
  DB_NAME: str({ default: testOnly('ugoku') }),
  PAYMENT_API_TOKEN: str({
    desc: 'Payment api token',
  }),
  AWS_ACCESS_KEY_ID: str({
    desc: 'AWS key id',
  }),
  AWS_SECRET_ACCESS_KEY: str({
    desc: 'AWS access key',
  }),
  AWS_REGION: str({
    devDefault: testOnly('ap-northeast-1'),
  }),
  AWS_BUCKET_NAME: str({
    devDefault: testOnly('studio-ugoku'),
  }),
});
