import express, { type Router } from 'express';
import { paymentController } from './paymentController';

export const paymentRouter: Router = express.Router();

paymentRouter.post('/invoice', paymentController.createInvoice);
paymentRouter.get('/history', paymentController.getPayments);
