const admin = require('firebase-admin');
const serviceAccountUrl = '../firebase-key';
var serviceAccount = require(serviceAccountUrl);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export * from './account';
export * from './store';
export * from './notification';
