import { Request, Response } from 'express';
import ProductManagement, { IProductManagement } from '../models/ProductManagement';
import Product from '../models/Product';
import { SortOrder } from 'mongoose';
import { escapeRegex } from '../helpers';

export class ProductManagementController {
  static getAllProductsManagement = async (req: Request, res: Response) => {
    try {
      const { term } = req.params;
      let productManagements: IProductManagement[];
      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

      if (term) {
        const escapedTerm = escapeRegex(term);
        const regex = new RegExp(escapedTerm, 'i');
        productManagements = await ProductManagement.find({
          $or: [
            { codeProduct: { $regex: regex } },
          ]
        }).sort(sortCriteria);
      } else {
        productManagements = await ProductManagement.find({}).sort(sortCriteria);
      }

      return res.status(200).json(productManagements);
    } catch (error) {
      console.error('Error fetching products management:', error);
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static getProductManagement = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productManagement = await ProductManagement.findById(id);
      if (!productManagement) {
        const error = new Error('Gestión no encontrada');
        return res.status(409).json({ error: error.message });
      }
      return res.json(productManagement);
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static createProductManagement = async (req: Request, res: Response) => {
    try {
      const { productId, productPrice } = req.body;
      const productExists = await Product.findOne({ _id: productId });
      if (!productExists) {
        const error = new Error('Producto no encontrado');
        return res.status(404).json({ error: error.message });
      }

      const productManagementExists = await ProductManagement.findOne({ productId });
      if (productManagementExists) {
        const error = new Error('El producto seleccionado ya tiene una gestión');
        return res.status(404).json({ error: error.message });
      }

      const newProductManagement = new ProductManagement({
        codeProduct: productExists.code,
        productId,
        productPrice
      });

      productExists.productManagementId = newProductManagement.id
      productExists.salePrice = productPrice;
      productExists.stock = newProductManagement.productQuantity
      productExists.state = 'notAvailable';

      await Promise.allSettled([newProductManagement.save(), productExists.save()]);

      res.status(200).send('Gestión realizada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static updateProductManagement = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { productPrice } = req.body;
      const productManagementExists = await ProductManagement.findById(id);
      if (!productManagementExists) {
        const error = new Error('Gestion no encontrada');
        return res.status(404).json({ error: error.message });
      }

      const currentProduct = await Product.findById(productManagementExists.productId);
      if (!currentProduct) {
        const error = new Error('Producto no encontrado');
        return res.status(404).json({ error: error.message });
      }

      productManagementExists.productPrice = productPrice;
      currentProduct.salePrice = productPrice;

      await Promise.allSettled([productManagementExists.save(), currentProduct.save()]);
      res.status(200).send('Gestión actualizada correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static deleteProductManagement = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productManagementExists = await ProductManagement.findById(id);
      if (!productManagementExists) {
        const error = new Error('Gestion no encontrada');
        return res.status(404).json({ error: error.message });
      }

      const currentProduct = await Product.findById(productManagementExists.productId);
      if (!currentProduct) {
        const error = new Error('Producto no encontrado');
        return res.status(404).json({ error: error.message });
      }

      currentProduct.salePrice = 0;
      currentProduct.state = 'notManaged';
      currentProduct.productManagementId = null;

      await Promise.allSettled([productManagementExists.deleteOne(), currentProduct.save()]);
      res.status(200).send('Gestión eliminada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }
}