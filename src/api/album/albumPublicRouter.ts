import express, { type Router } from 'express';
import { albumController } from './albumController';

export const albumPublicRouter: Router = express.Router();

albumPublicRouter.get('/:id', albumController.getAlbum);
albumPublicRouter.post('/get-by-ids', albumController.getAlbumByIds);
