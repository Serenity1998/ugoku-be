import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { distributorService } from './distributorService';

class DistributoreController {
  public getDistributors: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await distributorService.getAllDistributors();
    return handleServiceResponse(serviceResponse, res);
  };

  public getDistributor: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await distributorService.getDistributor(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public createDistributor: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await distributorService.createDistributor(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateDistributor: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await distributorService.updateDistributor(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteDistributor: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await distributorService.deleteDistributor(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const distributorController = new DistributoreController();
