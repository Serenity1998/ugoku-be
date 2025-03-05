import type { Request } from 'express';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { NotificationZodSchema } from '../../common/types/types';
import { zodErrorHandler } from '../../common/utils/httpHandlers';
import { Notification } from '../../models/notification';
import { notificationEndpoint } from '../../constants/app.constants';
import axios from 'axios';
import mongoose from 'mongoose';

class NotificationService {
  async getAllNotifications(): Promise<ServiceResponse> {
    try {
      const notifications = await Notification.find();
      return ServiceResponse.success<any>('Successfully retrieved all notifications', { data: notifications });
    } catch (ex) {
      const errorMessage = `Error retrieving notifications: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createNotification(_req: Request): Promise<ServiceResponse> {
    try {
      const parsedData = NotificationZodSchema.parse(_req.body);
      const topic =
        (parsedData.albumSubDivision || parsedData.albumDivision || 0).toString() + '-' + (parsedData.albumAge || 0).toString();
      const notification = new Notification({ ...parsedData, topic: parsedData.all ? 'all' : topic });
      const notification_doc = await notification.save();

      const obj = notification_doc.toObject();

      const response = await axios.post(notificationEndpoint, {
        data: { id: obj._id, title: obj.title, body: obj.body, topic: obj.all ? 'all' : topic },
      });

      return ServiceResponse.success<any>('Successfully created notification:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getAllNotificationsByIds(_req: Request): Promise<ServiceResponse> {
    try {
      const { notificationIds } = _req.body;
      const objectIds = notificationIds.map((id: string) => new mongoose.Types.ObjectId(id));

      const notifications = await Notification.find({ _id: { $in: objectIds } }).sort({ createdAt: -1 });

      return ServiceResponse.success<any>('Successfully retrieved all notifications', { data: notifications });
    } catch (ex) {
      const errorMessage = `Error retrieving notifications: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const notificationService = new NotificationService();
