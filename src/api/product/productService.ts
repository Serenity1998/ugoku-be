import type { Request } from "express";
import { ServiceResponse } from "../../common/types/serviceResponse";
import { ProductZodSchema } from "../../common/types/types";
import { zodErrorHandler } from "../../common/utils/httpHandlers";
import { Product } from "../../models/planModel";

class ProductService {
  async getAllProducts(): Promise<ServiceResponse> {
    try {
      const products = await Product.find();
      return ServiceResponse.success<any>(
        "Successfully retrieved all products",
        {
          data: products,
        }
      );
    } catch (ex) {
      const errorMessage = `Error retrieving products: ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }

  async createProduct(_req: Request): Promise<ServiceResponse> {
    try {
      const parsedData = ProductZodSchema.parse(_req.body);
      const product = new Product(parsedData);
      const product_doc = await product.save();

      const obj = product_doc.toObject();
      return ServiceResponse.success<any>("Successfully created product:", obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async updateProduct(_req: Request): Promise<ServiceResponse> {
    try {
      const productId = _req.params.id;
      const parsedData = ProductZodSchema.parse(_req.body);

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        parsedData,
        { new: true }
      );

      if (!updatedProduct)
        throw Error(`Product with ID ${productId} not found`);

      const obj = updatedProduct.toObject();

      return ServiceResponse.success<any>("Successfully updated product:", obj);
    } catch (ex) {
      let errorMessage = zodErrorHandler(ex);
      return ServiceResponse.failure(errorMessage);
    }
  }

  async deleteProduct(_req: Request): Promise<ServiceResponse> {
    try {
      const prodcutId = _req.params.id;
      const deleted = await Product.findByIdAndDelete(prodcutId);

      if (!deleted) throw Error(`Product with ID ${prodcutId} not found`);

      return ServiceResponse.success<any>("Successfully deleted product", null);
    } catch (ex) {
      const errorMessage = `Error deleting product (database error): ${ex}`;
      return ServiceResponse.failure(errorMessage);
    }
  }
}

export const productService = new ProductService();
