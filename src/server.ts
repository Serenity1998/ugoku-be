import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import * as serviceAccount from './firebase-key.json';

import { env } from './common/utils/envSetting';
import { paymentRouter } from './api/payment/paymentRouter';
import errorHandlers from './common/middlewares/errorHandlers';
import { storeRouter } from './api/store/storeRouter';
import { distributorRouter } from './api/distributor/distributorRouter';
import { planRouter } from './api/plan/planRouter';
import authenticateUser from './common/middlewares/firebase';
import { productRouter } from './api/product/productRouter';
import { mediaRouter } from './api/media/mediaRouter';
import { albumRouter } from './api/album/albumRouter';
import { userRouter } from './api/user/userRouter';
import { notificationRouter } from './api/notification/notificationRouter';
import { albumPublicRouter } from './api/album/albumPublicRouter';
import { mediaController } from './api/media/mediaController';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

app.use(cors({ origin: [env.CORS_ORIGIN, env.CORS_ORIGIN_STUDIO], credentials: true }));
app.use(express.json());

app.post('/mediacount', mediaController.mediaViewCounter);

app.use('/payment', paymentRouter);
app.use('/store', authenticateUser, storeRouter);
app.use('/distributor', distributorRouter);
app.use('/plan', planRouter);
app.use('/product', productRouter);
app.use('/media', authenticateUser, mediaRouter);
app.use('/album', authenticateUser, albumRouter);
app.use('/useralbum', albumPublicRouter);
app.use('/user', userRouter);
app.use('/notification', notificationRouter);

app.use(errorHandlers());

export { app };
