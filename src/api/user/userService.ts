import { Request } from 'express';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { zodErrorHandler } from '../../common/utils/httpHandlers';
import { User } from '../../models/userModel';

class UserService {
  async registerUserDevice(_req: Request): Promise<ServiceResponse<string>> {
    let user;
    try {
      const { deviceId, pushToken } = _req.body;
      user = await User.findOne({ deviceId: deviceId }).populate('deviceId');
      const inputData = {
        deviceId: deviceId,
        pushToken: pushToken,
      };

      if (!user) user = new User(inputData);
      else user.set({ pushToken: pushToken });
      const user_doc = await user.save();
      const userObject = user_doc.toObject();

      if (typeof userObject === 'string') throw Error(userObject);
      return ServiceResponse.success<any>('Successfully created user:', { user: userObject });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const userService = new UserService();
