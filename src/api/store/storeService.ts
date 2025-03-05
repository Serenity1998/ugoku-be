import { ServiceResponse } from '../../common/types/serviceResponse';
import { CompanyType, CompanyZodSchema, StoreZodSchema } from '../../common/types/types';
import { Company } from '../../models/companyModel';
import { Store, StoreStatus } from '../../models/storeModel';
import { Distributor } from '../../models/distributorModel';
import { AuthRequest, zodErrorHandler } from '../../common/utils/httpHandlers';
import { Plan, Product } from '../../models/planModel';
import { Types } from 'mongoose';
import moment from 'moment';
import axios from 'axios';
import { createAccountEndpoint } from '../../constants/app.constants';
import { Payment } from '../../models/paymentModel';

class StoreService {
  //Only main store - When user signup in onbaording screen
  async createCompanyAndStore(_req: AuthRequest): Promise<ServiceResponse> {
    let companyId;
    try {
      const storeExist = await Store.findById(_req.user.uid);
      if (storeExist) throw Error('Store already exist with this email');

      const companyObject = await this.#createCompany(_req.body.company);
      companyId = companyObject._id;

      const storeResult = await this.#createStore(
        _req.user.uid,
        _req.user.email!,
        _req.body.store,
        _req.body.plan,
        companyId,
        companyObject.companyDistributor,
      );

      return ServiceResponse.success<any>('Successfully created company:', {
        company: companyObject,
        store: storeResult,
      });
    } catch (ex) {
      if (companyId) await this.#deleteCompany(companyId);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Only for admin
  async createFreePartner(_req: AuthRequest): Promise<ServiceResponse> {
    let companyId;
    try {
      if (!_req.isSuperAdmin) throw Error('Not authorized');
      const storeExist = await Store.findById(_req.body.store.loginEmail);
      if (storeExist) throw Error('Store already exist with this email');

      const fbUser = await this.#createUser(_req.body.store.loginEmail, _req.token);
      if (!fbUser.status) throw Error(fbUser.msg);
      if (!fbUser.data.uid || !fbUser.data.email) throw Error('Error creating store account');

      const companyObject = await this.#createCompany(_req.body.company, false);
      companyId = companyObject._id;

      const storeResult = await this.#createStore(
        fbUser.data.uid,
        fbUser.data.email,
        _req.body.store,
        _req.body.plan,
        companyId,
        companyObject.companyDistributor,
      );

      return ServiceResponse.success<any>('Successfully created company:', {
        company: companyObject,
        store: storeResult,
      });
    } catch (ex) {
      if (companyId) await this.#deleteCompany(companyId);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or main store
  async updateCompany(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const { _id: companyId } = _req.body.company;
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;

      const store = await Store.findById(callerId);
      if (!store) throw Error('Store not found');

      if (!_req.isSuperAdmin) {
        if (!store.storePrimary) throw Error('You are not permitted to change company info');
        const isEditingOwnCompany = store.company?.equals(companyId);
        if (!isEditingOwnCompany) throw Error('You are not permitted to change this company info');
      }

      const companyParsedData = CompanyZodSchema.parse(_req.body.company);
      const updated = await Company.findByIdAndUpdate(companyId, companyParsedData, { new: true });
      if (updated == null) throw Error(`Couldn't find company: ${companyId}`);

      const companyObject = updated.toObject();
      return ServiceResponse.success<any>('Successfully updated company:', {
        company: companyObject,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or main store
  async createStore(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const callerStore = await Store.findById(callerId).populate('company');

      if (!callerStore) throw Error('Store not found');
      if (!_req.isSuperAdmin && !callerStore.storePrimary) throw Error('You are not permitted to change company info');

      const fbUser = await this.#createUser(_req.body.store.loginEmail, _req.token);
      if (!fbUser.status) throw Error(fbUser.msg);
      if (!fbUser.data.uid || !fbUser.data.email) throw Error('Error creating store account');

      const company = callerStore.company as any;
      const storeResult = await this.#createStore(
        fbUser.data.uid,
        fbUser.data.email,
        _req.body.store,
        _req.body.plan,
        company,
        company.companyDistributor,
      );

      return ServiceResponse.success<any>('Successfully created store:', {
        store: storeResult,
      });
    } catch (ex: any) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or main store or store owner
  async updateStore(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const callerStore = await Store.findById(callerId);
      if (!callerStore) throw Error('Store not found');

      const store = await Store.findById(_req.body.store._id);
      if (!store) throw Error('Store doesn`t exist with this ID');

      if (!_req.isSuperAdmin && !callerStore.storePrimary) throw Error('You are not permitted to change company info');

      const storeParsedData = StoreZodSchema.parse(_req.body.store);
      store.set({ ...storeParsedData });

      const store_doc = await store.save();
      const storeObject = store_doc.toObject();

      return ServiceResponse.success<any>('Successfully update store:', {
        store: storeObject,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or main store
  async getStoreList(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.query.callerId : _req.user.uid;
      const callerStore = await Store.findById(callerId);
      if (!callerStore) throw Error('Store not found');

      const stores = await Store.find({
        _id: { $ne: callerId },
        company: callerStore?.company,
      }).populate({
        path: 'status',
        populate: [
          { path: 'activePlan', model: 'Plan' },
          { path: 'nextPlan', model: 'Plan' },
        ],
      });

      return ServiceResponse.success<any>('Successfully fetched all stores:', {
        stores,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin
  async getAllStoreList(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      if (!_req.isSuperAdmin) throw Error('Not authorized');

      const stores = await Store.find().populate([
        {
          path: 'company',
          populate: [{ path: 'companyDistributor', model: 'Distributor' }],
        },
        {
          path: 'status',
          populate: [
            { path: 'activePlan', model: 'Plan' },
            { path: 'nextPlan', model: 'Plan' },
          ],
        },
      ]);

      return ServiceResponse.success<any>('Successfully fetched all stores:', {
        stores,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async getMyStore(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? (_req.query.callerId as string) : _req.user.uid;
      const store = await this.#getStore(callerId);
      return ServiceResponse.success<any>('Successfully fetched store:', {
        store,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getStore(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const store = await this.#getStore(_req.params.id);
      return ServiceResponse.success<any>('Successfully fetched store:', {
        store,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner or main store
  async updateStoreEmail(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      if (!_req.body.storeId || !_req.body.email) throw Error('Email and store id are required');
      const storeId = _req.body.storeId;
      const updated = await Store.findByIdAndUpdate(storeId, { loginEmail: _req.body.email }, { new: true });
      if (!updated) throw Error(`Store with ID ${updated} not found`);

      const obj = updated.toObject();
      return ServiceResponse.success<any>('Successfully updated store email:', obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async purchaseProduct(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const store = await this.#purchaseProduct(callerId, _req.body.productId);
      return ServiceResponse.success<any>('Successfully purchased product:', {
        store,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async cancelPlan(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const storeExist = await Store.findById(_req.body.storeId);
      if (!storeExist) throw Error('Store not found');

      const updated = await StoreStatus.findByIdAndUpdate(storeExist.status, { nextPlan: null }, { new: true });
      if (!updated) throw Error(`Store status not found`);

      storeExist.set({ statusText: 'Canceled', cancelReason: _req.body.reason || '' });
      const store_doc = await storeExist.save();
      const storeObject = store_doc.toObject();

      return ServiceResponse.success<any>('Successfully canceled plan:', {
        storeObject,
      });
    } catch (ex) {
      console.log(ex);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async changePlan(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const storeExist = await Store.findById(_req.body.storeId);
      if (!storeExist) throw Error('Store not found');

      const updated = await StoreStatus.findByIdAndUpdate(storeExist.status, { nextPlan: _req.body.newPlan }, { new: true });
      if (!updated) throw Error(`Store status not found`);

      storeExist.set({ statusText: 'Changed' });
      const store_doc = await storeExist.save();
      const storeObject = store_doc.toObject();

      return ServiceResponse.success<any>('Successfully changed plan:', {
        storeObject,
      });
    } catch (ex) {
      console.log(ex);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async #createCompany(company: any, distributorRequired = true) {
    let companyData;
    if (distributorRequired || company.companyDistributor) {
      const distributor = await Distributor.findById(company.companyDistributor);
      if (!distributor) throw Error('Distributor not found');

      const companyParsedData = CompanyZodSchema.parse(company);
      companyData = new Company({
        ...companyParsedData,
        companyDistributor: distributor.id,
      });
    } else {
      const companyParsedData = CompanyZodSchema.parse(company);
      companyData = new Company(companyParsedData);
    }
    const company_doc = await companyData.save();
    const company_populated_doc = await company_doc.populate('companyDistributor');
    return company_populated_doc.toObject();
  }

  async #createStore(
    storeUserUid: String,
    storeUserEmail: String,
    storeData: any,
    planId: string,
    company: any,
    distributor: any,
  ): Promise<any> {
    const plan = await Plan.findById(planId);
    if (!plan) throw Error('plan not found');

    //create status first
    const store_status_doc = await this.#createStoreStatus(plan, storeUserUid);

    //create store
    const storeParsedData = StoreZodSchema.parse({
      _id: storeUserUid,
      loginEmail: storeUserEmail,
      statusText: 'Active',
      ...storeData,
    });
    const store = new Store({
      company: company,
      status: store_status_doc.id,
      ...storeParsedData,
    });

    const store_doc = await store.save();
    const store_populated_doc = await store_doc.populate('status');
    const storeObject = store_populated_doc.toObject();

    if (plan.isTrial !== true && plan.price && plan.price > 0) {
      await this.#addToPaymentHistory(company, storeObject._id, plan.price, distributor, plan);
    }
    return storeObject;
  }

  async #createStoreStatus(plan: any, store: any) {
    const storeStatus = new StoreStatus({
      planStart: new Date(),
      planEnd:
        plan.type === 'monthly'
          ? moment(new Date()).add({ months: 1 })
          : plan.type === 'yearly'
          ? moment(new Date()).add({ years: 1 })
          : moment(new Date()).add({ years: 10 }),
      videosCreated: 0,
      planVideos: plan.videoLimit || 0,
      purchasedVideos: 0,
      activePlan: plan.id,
      nextPlan: plan.isTrial ? null : plan.id,
      store: store,
    });
    const store_status_doc = await storeStatus.save();
    return store_status_doc;
  }

  async #addToPaymentHistory(company: any, store: any, amount: number, distributor: any, plan: any) {
    const payment = new Payment({
      store: store,
      plan: plan,
      company: company,
      distributor: distributor,
      amount: amount,
    });
    const data_doc = await payment.save();
    return data_doc;
  }

  async #getStore(storeId: string) {
    const store = await Store.findById(storeId);
    if (!store) throw Error('Store does not exist');
    const store_populated_doc = await store.populate([
      {
        path: 'company',
        populate: [{ path: 'companyDistributor', model: 'Distributor' }],
      },
      {
        path: 'status',
        populate: [
          { path: 'activePlan', model: 'Plan' },
          { path: 'nextPlan', model: 'Plan' },
        ],
      },
    ]);

    return store_populated_doc.toObject();
  }

  async #deleteCompany(companyId: Types.ObjectId): Promise<any> {
    return Company.findByIdAndDelete(companyId);
  }

  async #createUser(loginEmail: string, idToken: string) {
    if (!loginEmail) throw Error('Login email is required');
    const data = { data: { email: loginEmail } };
    const response = await axios.post(createAccountEndpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data.result;
  }

  async #purchaseProduct(storeId: string, productId: string) {
    const store = await Store.findById(storeId);
    if (!store) throw Error('Store not found');

    const product = await Product.findById(productId);
    if (!product) throw Error('Product not found');

    const storeStatus = await StoreStatus.findById(store.status);
    if (!storeStatus) throw Error('Store status not found');

    const result = await StoreStatus.updateOne({ _id: store.status?._id }, { $inc: { purchasedVideos: product.videos || 0 } });

    return result;
  }
}

export const storeService = new StoreService();
