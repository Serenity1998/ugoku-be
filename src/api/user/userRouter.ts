import express, { type Router } from 'express';
import { userController } from './userController';

export const userRouter: Router = express.Router();

userRouter.post('/device', userController.registerUserDevice);
