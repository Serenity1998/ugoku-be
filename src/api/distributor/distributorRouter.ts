import express, { type Router } from 'express';
import { distributorController } from './distributorController';

export const distributorRouter: Router = express.Router();

distributorRouter.get('/list', distributorController.getDistributors);
distributorRouter.get('/:id', distributorController.getDistributor);
distributorRouter.post('/create', distributorController.createDistributor);
distributorRouter.post('/update/:id', distributorController.updateDistributor);
distributorRouter.delete('/delete/:id', distributorController.deleteDistributor);
