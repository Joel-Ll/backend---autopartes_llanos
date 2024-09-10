import { Request, Response } from 'express';
import ProductManagement from '../models/ProductManagement';
import Product from '../models/Product';
import { THRESHOLD_LOW, escapeRegex } from '../helpers';
import PurchaseHistory from '../models/PurchaseHistory';
import { SortOrder } from 'mongoose';

export class PurcheProductController {
  static createPurchaseHistoryProduct = async (req: Request, res: Response) => {
    try {
      const {
        idProductManagement,
        nameSupplier,
        codeProduct,
        descProduct,
        unitQuantity,
        purchasePrice,
        purchaseDesc
      } = req.body;

      const productManagement = await ProductManagement.findById(idProductManagement);
      if (!productManagement) {
        const error = new Error('Gestión de producto no encontrada');
        return res.status(404).json({ error: error.message });
      }

      const currentProduct = await Product.findById(productManagement.productId);
      if (!currentProduct) {
        const error = new Error('Producto no encontrado');
        return res.status(404).json({ error: error.message });
      }

      // Actualizamos los datos entrantes en la gestion de productos
      productManagement.productQuantity += unitQuantity;
      productManagement.expenses += purchasePrice;

      // Actualizamos el estado del producto...
      if (productManagement.productQuantity === 0) {
        currentProduct.state = 'notAvailable';
      } else if (productManagement.productQuantity > 0 && productManagement.productQuantity < THRESHOLD_LOW) {
        currentProduct.state = 'lowStock';
      } else if (productManagement.productQuantity >= THRESHOLD_LOW) {
        currentProduct.state = 'available';
      }

      currentProduct.stock = productManagement.productQuantity

      const newPurchaseHistoryProduct = new PurchaseHistory({
        nameSupplier,
        codeProduct,
        descProduct,
        unitQuantity,
        purchasePrice,
        purchaseDesc
      });

      await Promise.allSettled([productManagement.save(), currentProduct.save(), newPurchaseHistoryProduct.save()]);
      res.status(200).send('Se realizó el registro de compra');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static getAllPurchaseHistory = async (req: Request, res: Response) => {
    try {
      const { term = '', startDate, endDate } = req.query as { term: string; startDate?: string; endDate?: string };

      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

      // Filtros
      let query: { [key: string]: any } = {};

      // Filtro por término de búsqueda
      if (term) {
        // Escapar caracteres especiales en term
        const escapedTerm = escapeRegex(term);
        const regex = new RegExp(escapedTerm, 'i');
        query.$or = [
          { nameSupplier: { $regex: regex } },
          { codeProduct: { $regex: regex } },
        ];
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate); // Fecha de inicio
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate); // Fecha de fin
        }
      }

      // Consulta con filtros aplicados
      const purchasesHistory = await PurchaseHistory.find(query).sort(sortCriteria);

      return res.status(200).json(purchasesHistory);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static deletePurchaseHistory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const purchaseHistory = await PurchaseHistory.findById(id);
      if(!purchaseHistory) {
        const error = new Error('No se pudo encontrar el registro');
        return res.status(404).json({error: error.message});
      }
      await purchaseHistory.deleteOne();
      res.status(200).send('Se eliminó el registro correctamente');
    } catch (error) {
      res.status(500).json({error: 'Hubo un error'});
    }
  }

  static getPurchaseProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const purchaseHistory = await PurchaseHistory.findById(id);
      if (!purchaseHistory) {
        const error = new Error('Registro no encontrado');
        return res.status(409).json({ error: error.message });
      }
      return res.json(purchaseHistory);
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }
}