import type { Request } from 'express';
import Payjp, { List } from 'payjp';
import { env } from '../../common/utils/envSetting';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { zodErrorHandler } from '../../common/utils/httpHandlers';
import { Payment } from '../../models/paymentModel';

const payjp = Payjp(env.PAYMENT_API_TOKEN);

class PaymentService {
  async createCard(_req: Request): Promise<ServiceResponse<Payjp.Card | null>> {
    try {
      const { customerId, cardInfo } = _req.body;
      const card = await payjp.customers.cards.create(customerId, cardInfo);
      return ServiceResponse.success<Payjp.Card>('Successfully created card:', card);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getCustomers(_req: Request): Promise<ServiceResponse<List<Payjp.Customer> | null>> {
    try {
      const { limit, offset } = _req.body;
      const customers = await payjp.customers.list({
        limit: limit || 10,
        offset: offset || 10,
      });
      return ServiceResponse.success<List<Payjp.Customer>>('Successfully fetched customers:', customers);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createCustomer(_req: Request): Promise<ServiceResponse<Payjp.Customer | null>> {
    try {
      const { user_id } = _req.body;
      const customer = await payjp.customers.create({
        metadata: { user_id: user_id },
      });
      return ServiceResponse.success<Payjp.Customer>('Successfully new customer created:', customer);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createSubscription(_req: Request): Promise<ServiceResponse<Payjp.Subscription | null>> {
    try {
      const { customerId, planId, trial_end } = _req.body;
      const subscription = await payjp.subscriptions.create({
        customer: customerId,
        plan: planId,
        trial_end,
      });
      return ServiceResponse.success<Payjp.Subscription>('Successfully subscription created:', subscription);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getPaymentHistory(_req: Request): Promise<ServiceResponse> {
    try {
      const start: string = _req.query.start as string;
      const end: string = _req.query.end as string;
      const payments = await Payment.find({
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      })
        .populate('distributor')
        .populate('company')
        .populate('plan')
        .populate('store');
      return ServiceResponse.success<any>('Successfully retrieved all payments', { data: payments });
    } catch (ex) {
      const errorMessage = `Error retrieving notifications: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const paymentService = new PaymentService();
