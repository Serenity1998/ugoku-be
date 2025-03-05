import type { Request, RequestHandler, Response } from 'express';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { paymentService } from './paymentService';

class PaymentController {
  public createInvoice: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await paymentService.createSubscription(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public getPayments: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await paymentService.getPaymentHistory(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const paymentController = new PaymentController();
