import type { Request } from 'express';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { DistributorZodSchema } from '../../common/types/types';
import { Distributor } from '../../models/distributorModel';
import { zodErrorHandler } from '../../common/utils/httpHandlers';

class DistributoreService {
  async getAllDistributors(): Promise<ServiceResponse> {
    try {
      const distributors = await Distributor.find();
      return ServiceResponse.success<any>('Successfully retrieved all distributors', { data: distributors });
    } catch (ex) {
      const errorMessage = `Error retrieving distributors: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getDistributor(_req: Request): Promise<ServiceResponse> {
    try {
      const distributor = await Distributor.findById(_req.params.id);
      const obj = distributor?.toObject();
      if (!distributor) throw Error('Distributor does not exist');

      return ServiceResponse.success<any>('Successfully fetched store:', {
        distributor: obj,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createDistributor(_req: Request): Promise<ServiceResponse> {
    try {
      const parsedData = DistributorZodSchema.parse(_req.body);
      const distributor = new Distributor(parsedData);
      const distributor_doc = await distributor.save();

      const obj = distributor_doc.toObject();

      return ServiceResponse.success<any>('Successfully created distributor:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async updateDistributor(_req: Request): Promise<ServiceResponse> {
    try {
      const distributorId = _req.params.id;
      const parsedData = DistributorZodSchema.parse(_req.body);

      const updatedDistributor = await Distributor.findByIdAndUpdate(distributorId, parsedData, { new: true });

      if (!updatedDistributor) throw Error(`Distributor with ID ${distributorId} not found`);

      const obj = updatedDistributor.toObject();

      return ServiceResponse.success<any>('Successfully updated distributor:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async deleteDistributor(_req: Request): Promise<ServiceResponse> {
    try {
      const distributorId = _req.params.id;
      const deletedDistributor = await Distributor.findByIdAndDelete(distributorId);

      if (!deletedDistributor) throw Error(`Distributor with ID ${distributorId} not found`);

      return ServiceResponse.success<any>('Successfully deleted distributor', null);
    } catch (ex) {
      const errorMessage = `Error deleting distributor (database error): ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const distributorService = new DistributoreService();
