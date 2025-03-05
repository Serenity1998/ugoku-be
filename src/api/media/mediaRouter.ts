import express, { type Router } from 'express';
import { mediaController } from './mediaController';

export const mediaRouter: Router = express.Router();

mediaRouter.post('/upload', mediaController.generateMediaUrl);
mediaRouter.post('/download', mediaController.generateDownloadUrl);
mediaRouter.post('/create-media', mediaController.createUpdateMedia);
mediaRouter.post('/delete', mediaController.deleteMedia);
mediaRouter.get('/check-permission', mediaController.checkPermission);
mediaRouter.get('/report', mediaController.generateReport);
