import type { Request, RequestHandler, Response } from 'express';
import { AuthRequest, handleServiceResponse } from '../../common/utils/httpHandlers';
import { albumService } from './albumService';

class AlbumController {
  public createAlbum: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await albumService.createAlbum(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAlbumList: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await albumService.getAlbumList(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAlbum: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await albumService.getAlbum(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAlbumByIds: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await albumService.getAlbumsByIds(_req as AuthRequest);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const albumController = new AlbumController();
