import mongoose from 'mongoose';
import { env } from './common/utils/envSetting';
import { app } from './server';

// Connect to MongoDB
mongoose
  .connect(env.DB_CONNECTION_URL, { dbName: env.DB_NAME })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  });

const server = app.listen(env.PORT, '0.0.0.0', () => {
  const { NODE_ENV, HOST, PORT } = env;
  console.log(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  console.log('sigint received, shutting down');
  server.close(() => {
    console.log('mongoose disconnected');
    mongoose.disconnect();
    console.log('server closed');
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
