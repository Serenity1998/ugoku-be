import express, { type Router } from 'express';
import { planController } from './planController';

export const planRouter: Router = express.Router();

planRouter.get('/list', planController.getPlans);
planRouter.get('/admin/list', planController.getPlansForAdmin);
planRouter.post('/create', planController.createPlan);
planRouter.put('/update/:id', planController.updatePlan);
planRouter.delete('/delete/:id', planController.deletePlan);
