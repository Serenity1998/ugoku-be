import type { Request } from 'express';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { PlanZodSchema } from '../../common/types/types';
import { Plan } from '../../models/planModel';
import { zodErrorHandler } from '../../common/utils/httpHandlers';

class PlanService {
  async getAllPlans(): Promise<ServiceResponse> {
    try {
      const sortOptions: { [key: string]: 1 | -1 } = {
        ['order']: 1,
      };
      const plans = await Plan.find({ type: { $ne: 'test_account' } }).sort(sortOptions);
      return ServiceResponse.success<any>('Successfully retrieved all plans', {
        data: plans,
      });
    } catch (ex) {
      const errorMessage = `Error retrieving plans: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getAllPlansForAdmin(): Promise<ServiceResponse> {
    try {
      const sortOptions: { [key: string]: 1 | -1 } = {
        ['order']: 1,
      };
      const plans = await Plan.find().sort(sortOptions);
      return ServiceResponse.success<any>('Successfully retrieved all plans', {
        data: plans,
      });
    } catch (ex) {
      const errorMessage = `Error retrieving plans: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createPlan(_req: Request): Promise<ServiceResponse> {
    try {
      const parsedData = PlanZodSchema.parse(_req.body);
      const plan = new Plan(parsedData);
      const plan_doc = await plan.save();

      const obj = plan_doc.toObject();
      return ServiceResponse.success<any>('Successfully created plan:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async updatePlan(_req: Request): Promise<ServiceResponse> {
    try {
      const planId = _req.params.id;
      const parsedData = PlanZodSchema.parse(_req.body);

      const updatedPlan = await Plan.findByIdAndUpdate(planId, parsedData, {
        new: true,
      });

      if (!updatedPlan) throw Error(`Plan with ID ${planId} not found`);

      const obj = updatedPlan.toObject();
      return ServiceResponse.success<any>('Successfully updated plan:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async deletePlan(_req: Request): Promise<ServiceResponse> {
    try {
      const planId = _req.params.id;
      const deletedPlan = await Plan.findByIdAndDelete(planId);

      if (!deletedPlan) throw Error(`Plan with ID ${planId} not found`);
      return ServiceResponse.success<any>('Successfully deleted plan', null);
    } catch (ex) {
      const errorMessage = `Error deleting plan (database error): ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const planService = new PlanService();
