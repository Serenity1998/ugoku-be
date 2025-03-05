import express, { type Router } from 'express';
import { storeController } from './storeController';

export const storeRouter: Router = express.Router();

storeRouter.post('/create-company', storeController.createCompany);
storeRouter.post('/create-free-company', storeController.createFreeCompany);
storeRouter.post('/create-store', storeController.createStore);
storeRouter.get('/list', storeController.getStoreList);
storeRouter.get('/my-store', storeController.getMyStore);
storeRouter.get('/:id', storeController.getStore);
storeRouter.post('/update-email', storeController.updateStoreEmail);
storeRouter.post('/purchase', storeController.purchaseProduct);
storeRouter.post('/update-company', storeController.updateCompany);
storeRouter.post('/update-store', storeController.updateStore);
storeRouter.post('/cancel-plan', storeController.cancelPlan);
storeRouter.post('/change-plan', storeController.changePlan);
storeRouter.get('/admin/list', storeController.getAllStoreList);
