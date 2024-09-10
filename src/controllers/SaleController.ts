import { Request, Response } from 'express';
import Supplier, { ISupplier } from '../models/Supplier';
import { SortOrder } from 'mongoose';
import { THRESHOLD_LOW, escapeRegex } from '../helpers';
import Sale, { TSale } from '../models/Sale';
import Product from '../models/Product';
import ProductManagement from '../models/ProductManagement';
import puppeteer from 'puppeteer';
import { isSea } from 'node:sea';
import { contains } from 'validator';

export class SaleController {


  static createSale = async (req: Request, res: Response) => {
    try {
      const { nameCustomer, products, totalPrice, description } = req.body;

      for (const product of products) {
        if (product.idProduct) {
          const currentProduct = await Product.findById(product.idProduct);
          if (!currentProduct) {
            return res.status(404).json({ error: `Producto con código: ${product.codeProduct} no encontrado.` });
          }
          const currentProductManagement = await ProductManagement.findById(currentProduct.productManagementId);
          if (!currentProductManagement) {
            return res.status(404).json({ error: `Gestión de producto para ${currentProduct.name} no encontrada.` });
          }
          currentProductManagement.productQuantity -= product.quantity
          if (currentProductManagement.productQuantity < 0) {
            const error = new Error(`El producto ${currentProduct.name} alcanzó el limite de venta`);
            return res.status(404).json({ error: error.message });
          }

          currentProduct.stock -= product.quantity;
          if (currentProduct.stock < 0) {
            return res.status(404).json({ error: `El stock del producto ${currentProduct.name} no puede ser negativo.` });
          }

          if (currentProductManagement.productQuantity === 0) {
            currentProduct.state = 'notAvailable';
          } else if (currentProductManagement.productQuantity > 0 && currentProductManagement.productQuantity < THRESHOLD_LOW) {
            currentProduct.state = 'lowStock';
          } else if (currentProductManagement.productQuantity >= THRESHOLD_LOW) {
            currentProduct.state = 'available';
          }

          currentProductManagement.income += product.subtotal;
          currentProductManagement.salesQuantity += product.quantity;

          await Promise.allSettled([currentProduct.save(), currentProductManagement.save()]);
        }
      };

      const newSale = new Sale({
        nameCustomer, products, totalPrice, description
      });

      await newSale.save();
      res.status(200).send('Venta realizada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error en el proceso de venta' });
    }
  }
  
  static getSale = async (req: Request, res: Response) => {
    try {
      const { idSale } = req.params;
      const sale = await Sale.findById(idSale);
      if(!sale) {
        const error = new Error('Registro de venta no encontrada');
        return res.status(404).json({error: error.message});
      }
      return res.status(200).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static getAllSales = async (req: Request, res: Response) => {
    try {
      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

      // Consulta con filtros aplicados
      const sales = await Sale.find().sort(sortCriteria);
      return res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static deleteSale = async (req: Request, res: Response) => {
    try {
      const { idSale } = req.params;
      // Verificar si el producto existe
      const SaleExists = await Sale.findById(idSale);
      if (!SaleExists) {
        return res.status(409).json({ error: 'Venta no encontrada' });
      }

      await SaleExists.deleteOne();
      return res.status(200).send('Registro de venta eliminada');
    } catch (error) {
      return res.status(400).json({ error: 'Hubo un error' });
    }
  }
}