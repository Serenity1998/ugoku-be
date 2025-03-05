import type { Request } from 'express';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { zodErrorHandler } from '../../common/utils/httpHandlers';
import { Media } from '../../models/mediaModel';
import { MediaHistory } from '../../models/mediaHistory';

class MediaReportService {
  async mediaViewCount(_req: Request): Promise<ServiceResponse> {
    try {
      const { mediaUrl } = _req.body;
      if (!mediaUrl) throw Error('mediaUrl is required');

      const media = await Media.findOneAndUpdate(
        { mediaUrl },
        { $inc: { views: 1 }, $set: { updatedAt: Date.now() } },
        { new: true },
      );

      const mediaHistory = new MediaHistory({
        mediaUrl,
        mediaId: media?._id,
        store: media?.store,
      });

      await mediaHistory.save();

      return ServiceResponse.success<any>('Successfully incremented views:', { media });
    } catch (error) {
      let errorMessage = zodErrorHandler(error);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async generateReports(_req: Request): Promise<ServiceResponse> {
    try {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const report = await MediaHistory.aggregate([
        {
          $match: {
            createdAt: { $gte: last30Days },
          },
        },
        {
          $group: {
            _id: '$store',
            totalViews: { $sum: 1 },
            last7DaysViews: {
              $sum: {
                $cond: [{ $gte: ['$createdAt', last7Days] }, 1, 0],
              },
            },
            last30DaysViews: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: '_id',
            foreignField: '_id',
            as: 'storeData',
          },
        },
        {
          $unwind: '$storeData',
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'storeData.company',
            foreignField: '_id',
            as: 'companyData',
          },
        },
        {
          $unwind: '$companyData',
        },
        {
          $project: {
            storeId: '$_id',
            totalViews: 1,
            last7DaysViews: 1,
            last30DaysViews: 1,
            store: '$storeData',
            companyName: '$companyData.companyName',
          },
        },
      ]);

      return ServiceResponse.success<any>('Successfully incremented views:', report);
    } catch (error) {
      let errorMessage = zodErrorHandler(error);
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const mediaReportService = new MediaReportService();
