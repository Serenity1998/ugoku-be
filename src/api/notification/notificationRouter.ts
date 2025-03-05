import express, { type Router } from 'express';
import { notificationController } from './notificationController';

export const notificationRouter: Router = express.Router();

notificationRouter.get('/list', notificationController.getNotifications);
notificationRouter.post('/create', notificationController.createNotification);
notificationRouter.post('/list', notificationController.getNotificationsByIds);
