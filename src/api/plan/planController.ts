import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { planService } from './planService';

class PlanController {
  public getPlans: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await planService.getAllPlans();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPlansForAdmin: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await planService.getAllPlansForAdmin();
    return handleServiceResponse(serviceResponse, res);
  };

  public createPlan: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await planService.createPlan(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public updatePlan: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await planService.updatePlan(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public deletePlan: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await planService.deletePlan(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const planController = new PlanController();
