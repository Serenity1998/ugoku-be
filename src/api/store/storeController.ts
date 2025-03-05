import type { Request, RequestHandler, Response } from 'express';
import { AuthRequest, handleServiceResponse } from '../../common/utils/httpHandlers';
import { storeService } from './storeService';

class StoreController {
  public createCompany: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.createCompanyAndStore(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public createFreeCompany: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.createFreePartner(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public createStore: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.createStore(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getStoreList: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.getStoreList(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllStoreList: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.getAllStoreList(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getMyStore: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.getMyStore(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getStore: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.getStore(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateStoreEmail: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.updateStoreEmail(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public purchaseProduct: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.purchaseProduct(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateCompany: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.updateCompany(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateStore: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.updateStore(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public cancelPlan: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.cancelPlan(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public changePlan: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await storeService.changePlan(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const storeController = new StoreController();
