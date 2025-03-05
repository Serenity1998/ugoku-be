import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { notificationService } from './notificationService';

class NotificationController {
  public getNotifications: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await notificationService.getAllNotifications();
    return handleServiceResponse(serviceResponse, res);
  };

  public createNotification: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await notificationService.createNotification(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public getNotificationsByIds: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await notificationService.getAllNotificationsByIds(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const notificationController = new NotificationController();
