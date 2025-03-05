import type { Request, RequestHandler, Response } from 'express';
import { AuthRequest, handleServiceResponse } from '../../common/utils/httpHandlers';
import { mediaService } from './mediaService';
import { mediaReportService } from './mediaReportService';

class MediaController {
  public checkPermission: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaService.checkVideoPermission(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public createUpdateMedia: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaService.createMedia(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteMedia: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaService.deleteMedia(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public generateMediaUrl: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaService.getUploadUrl(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public generateDownloadUrl: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaService.getDownloadUrl(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public mediaViewCounter: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaReportService.mediaViewCount(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public generateReport: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await mediaReportService.generateReports(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const mediaController = new MediaController();
