import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { userService } from './userService';

class UserController {
  public registerUserDevice: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.registerUserDevice(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
