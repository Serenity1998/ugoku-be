import express, { type Router } from "express";
import { productController } from "./productController";

export const productRouter: Router = express.Router();

productRouter.get("/list", productController.getProducts);
productRouter.post("/create", productController.createProduct);
productRouter.put("/update/:id", productController.updateProduct);
productRouter.delete("/delete/:id", productController.deleteProduct);
