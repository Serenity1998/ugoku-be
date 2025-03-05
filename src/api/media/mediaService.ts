import { env } from '../../common/utils/envSetting';
import { ServiceResponse } from '../../common/types/serviceResponse';
import { AuthRequest, zodErrorHandler } from '../../common/utils/httpHandlers';
import { generateFileName, getPlainUrl } from '../../common/utils/fileManager';
import { Album } from '../../models/albumModel';
import { Media } from '../../models/mediaModel';
import { MediaZodSchema } from '../../common/types/types';
import { Store, StoreStatus } from '../../models/storeModel';

const BUCKET_NAME = env.AWS_BUCKET_NAME;

class MediaService {
  //Super admin or store owner
  async checkVideoPermission(_req: AuthRequest): Promise<ServiceResponse<string>> {
    try {
      const callerId = _req.isSuperAdmin ? (_req.query.callerId as string) : _req.user.uid;
      const { isValid } = await this.#checkVideoPermission(callerId);
      return ServiceResponse.success<any>('Successfully checked permission:', {
        permitted: isValid,
      });
    } catch (ex) {
      console.log(ex);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async createMedia(_req: AuthRequest): Promise<ServiceResponse<string>> {
    try {
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const { isValid, store } = await this.#checkVideoPermission(callerId);
      if (!isValid) throw Error("You don't have permission to create video");

      const { albumId } = _req.body;
      const album = await Album.findById(albumId);
      if (!album) throw Error('Album doesn`t exist');

      await this.#incrementVideoCounter(store.status);

      const inputData = MediaZodSchema.parse(_req.body.media);
      const media = new Media({ ...inputData, album: album.id, store: album.store });

      const media_doc = await media.save();
      const mediaObject = media_doc.toObject();

      return ServiceResponse.success<any>('Successfully created album:', { media: mediaObject });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async deleteMedia(_req: AuthRequest): Promise<ServiceResponse<string>> {
    try {
      const { mediaId } = _req.body;
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const storeExist = await Store.findById(callerId).populate('status');
      if (!storeExist) throw Error('Store doesn`t exist with this email');

      const media = await Media.findByIdAndDelete(mediaId);
      await this.#decrementVideoCounter(storeExist.status?._id);

      return ServiceResponse.success<any>('Successfully deleted media from album:', { media });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getUploadUrl(_req: AuthRequest): Promise<ServiceResponse<string>> {
    try {
      const { albumId, fileName } = _req.body.upload;
      if (!albumId) throw Error(`Couldn't find any album with ID: ${albumId}`);
      const generatedName = await generateFileName(fileName, albumId);
      const uploadUrl = await getPlainUrl(BUCKET_NAME, generatedName);
      return ServiceResponse.success<any>('Successfully created upload url:', { uploadUrl, key: generatedName });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async getDownloadUrl(_req: AuthRequest): Promise<ServiceResponse<string>> {
    try {
      const { fileName } = _req.body.upload;
      if (fileName) throw Error(`Couldn't find any file named ${fileName}`);
      const uploadUrl = await getPlainUrl(BUCKET_NAME, fileName);
      return ServiceResponse.success<any>('Successfully created download url:', { uploadUrl, fileName });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async #checkVideoPermission(storeId: string): Promise<{ isValid: boolean; store: any }> {
    try {
      const storeExist = await Store.findById(storeId).populate('status');
      if (!storeExist) throw Error('Store doesn`t exist with this email');

      const created = (storeExist.status as any).videosCreated;
      const planVideos = (storeExist.status as any).planVideos;
      const purchasedVideos = (storeExist.status as any).purchasedVideos;

      return {
        isValid: created < planVideos + purchasedVideos,
        store: storeExist,
      };
    } catch (ex) {
      return { isValid: false, store: null };
    }
  }

  async #incrementVideoCounter(statusId: string) {
    const updated = await StoreStatus.findByIdAndUpdate(statusId, { $inc: { videosCreated: 1 } }, { new: true });
    return updated;
  }

  async #decrementVideoCounter(statusId: any) {
    const updated = await StoreStatus.findByIdAndUpdate(statusId, { $inc: { videosCreated: -1 } }, { new: true });
    return updated;
  }
}

export const mediaService = new MediaService();
