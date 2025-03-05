import express, { type Router } from 'express';
import { albumController } from './albumController';

export const albumRouter: Router = express.Router();

albumRouter.post('/create', albumController.createAlbum);
albumRouter.get('/list', albumController.getAlbumList);
albumRouter.get('/:id', albumController.getAlbum);
