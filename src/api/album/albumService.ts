import { ServiceResponse } from '../../common/types/serviceResponse';
import { AlbumZodSchema } from '../../common/types/types';
import { AuthRequest, zodErrorHandler } from '../../common/utils/httpHandlers';
import { Album } from '../../models/albumModel';
import { Media } from '../../models/mediaModel';
import { Store } from '../../models/storeModel';
import type { Request } from 'express';

class AlbumService {
  //Super admin or store owner
  async createAlbum(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.body.callerId : _req.user.uid;
      const callerStore = await Store.findById(callerId);
      if (!callerStore) throw Error('Store doesn`t exist');
      if (!callerStore.company) throw Error(`Couldn't find any company with ID: ${callerStore.company}`);

      const { _id } = _req.body.album;
      const inputData = AlbumZodSchema.parse(_req.body.album);

      let album;
      if (_id) {
        album = await Album.findById(_id);
        if (album == null) throw Error(`"Couldn't find album: ${album}`);
        album.set(inputData);
      } else album = new Album({ ...inputData, company: callerStore.company, store: callerId });

      const album_doc = await album.save();
      const albumObject = album_doc.toObject();

      return ServiceResponse.success<any>('Successfully created album:', { album: albumObject });
    } catch (ex) {
      console.log(ex);
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async getAlbumList(_req: AuthRequest): Promise<ServiceResponse> {
    try {
      const callerId = _req.isSuperAdmin ? _req.query.callerId : _req.user.uid;
      const callerStore = await Store.findById(callerId);
      if (!callerStore) throw Error('Store doesn`t exist with this email');

      const albums = await Album.aggregate([
        { $match: { store: callerStore._id } },
        {
          $lookup: {
            from: 'media',
            localField: '_id',
            foreignField: 'album',
            as: 'mediaFiles',
          },
        },
        {
          $addFields: {
            totalMediaViews: { $sum: '$mediaFiles.views' },
          },
        },
        {
          $project: {
            mediaFiles: 0,
          },
        },
      ]);

      return ServiceResponse.success<any>('Successfully fetched all albums:', {
        albums,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async getAlbum(_req: Request): Promise<ServiceResponse> {
    try {
      const album = await Album.findOne({
        albumId: _req.params.id,
      }).populate('store');

      const videos = await Media.find({
        album: album?._id,
      });

      if (!album) throw Error('Album does not exist');
      return ServiceResponse.success<any>('Successfully fetched album:', {
        album,
        videos,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  //Super admin or store owner
  async getAlbumsByIds(_req: Request): Promise<ServiceResponse> {
    try {
      const albums = await Album.find({
        albumId: { $in: _req.body.ids },
      });

      return ServiceResponse.success<any>('Successfully fetched album:', {
        albums: albums,
      });
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const albumService = new AlbumService();
