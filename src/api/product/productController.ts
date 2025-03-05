import type { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "../../common/utils/httpHandlers";
import { productService } from "./productService";

class ProductController {
  public getProducts: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await productService.getAllProducts();
    return handleServiceResponse(serviceResponse, res);
  };

  public createProduct: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await productService.createProduct(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateProduct: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await productService.updateProduct(_req);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteProduct: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await productService.deleteProduct(_req);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const productController = new ProductController();
