import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { SortOrder } from 'mongoose';
import { escapeRegex } from '../helpers';
import ProductManagement from '../models/ProductManagement';

export class ProductController {
  static getFilteredProduct = async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      const productExists = await Product.findOne({ code });
      if (!productExists) {
        const error = new Error('Producto no encontrado');
        return res.status(404).json({ error: error.message });
      }

      const category = await Category.findById(productExists.category);
      if (!category) {
        const error = new Error('Categoria no encontrada');
        return res.status(404).json({ error: error.message });
      }
      
      return res.status(200).json({
        _id: productExists.id,
        name: productExists.name,
        code: productExists.code,
        description: productExists.description,
        category: category.name
      })

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const { term = '', status = '', category = '' } = req.query as { term: string; status: string; category: string };

      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };

      // Filtros
      let query: { [key: string]: any } = {};

      // Filtro por término de búsqueda
      if (term) {
        // Escapar caracteres especiales en term
        const escapedTerm = escapeRegex(term);
        const regex = new RegExp(escapedTerm, 'i');
        query.$or = [
          { description: { $regex: regex } },
          { code: { $regex: regex } },
        ];
      }

      // Filtro por estado
      if (status) {
        query.state = status;
      }

      // Filtro por categoría
      if (category) {
        query.category = category;
      }

      // Consulta con filtros aplicados
      const products = await Product.find(query).sort(sortCriteria);

      return res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static getProduct = async (req: Request, res: Response) => {
    try {
      const { idProduct } = req.params;
      const product = await Product.findById(idProduct);
      if (!product) {
        const error = new Error('Producto no encontrado');
        return res.status(409).json({ error: error.message });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static createProduct = async (req: Request, res: Response) => {
    try {
      const { category, name, code, description } = req.body;

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(409).json({ error: 'Categoría no encontrada' });
      }

      const productExists = await Product.findOne({ code });
      if (productExists) {
        return res.status(409).json({ error: `El producto con el código: ${code} ya está registrado` });
      }

      const newProduct = new Product({
        category, name, code: code, description
      });

      categoryExists.products.push(newProduct.id);
      await Promise.allSettled([newProduct.save(), categoryExists.save()]);
      res.status(200).send('Producto creado correctamente');

    } catch (error) {
      return res.status(400).json({ error: 'Hubo un error' });
    }
  }

  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { idProduct } = req.params;
      const { category, name, code, description } = req.body;

      // Verificar si la categoría nueva existe
      const newCategory = await Category.findById(category);
      if (!newCategory) {
        return res.status(409).json({ error: 'Categoría no encontrada' });
      }

      // Verificar si el producto existe
      const productExists = await Product.findById(idProduct);
      if (!productExists) {
        return res.status(409).json({ error: 'Producto no encontrado' });
      }




      // Verificar si el código de producto ya está en uso por otro producto
      const duplicateProduct = await Product.findOne({ code, _id: { $ne: idProduct } });
      if (duplicateProduct) {
        return res.status(409).json({ error: 'El código de producto ya está en uso por otro producto' });
      }

      // Guardar la referencia de la categoría actual
      const currentCategory = await Category.findById(productExists.category);

      // Verificar si la categoría ha cambiado
      if (productExists.category.toString() !== category) {
        // Eliminar el producto de la categoría actual
        if (currentCategory) {
          currentCategory.products = currentCategory.products.filter(product => product._id.toString() !== productExists.id.toString());
          await currentCategory.save();
        }

        // Agregar el producto a la nueva categoría
        newCategory.products.push(productExists.id);
        productExists.category = category;
      }

      // Actualizar los demás campos del producto
      productExists.name = name;
      productExists.code = code;
      productExists.description = description;

      // Verificar si tiene una gestion...
      const productManagementExist = await ProductManagement.findById(productExists.productManagementId)
      if (productManagementExist) {
        productManagementExist.codeProduct = code;
        await productManagementExist.save();
      }
      // Guardar los cambios
      await Promise.all([newCategory.save(), productExists.save()]);

      return res.status(200).send('Producto actualizado correctamente');
    } catch (error) {
      return res.status(400).json({ error: 'Hubo un error' });
    }
  }

  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { idProduct } = req.params;
      // Verificar si el producto existe
      const productExists = await Product.findById(idProduct);
      if (!productExists) {
        return res.status(409).json({ error: 'Producto no encontrado' });
      }

      const currentCategory = await Category.findById(productExists.category);
      if (!currentCategory) {
        return res.status(409).json({ error: 'Categoría no encontrada' });
      }

      const productManagementExists = await ProductManagement.findById(productExists.productManagementId);
      if (productManagementExists) {
        await productManagementExists.deleteOne();
      }

      currentCategory.products = currentCategory.products.filter(productId => productId.toString() !== productExists.id.toString());
      await Promise.allSettled([productExists.deleteOne(), currentCategory.save()]);
      return res.status(200).send('Producto eliminado correctamente');
    } catch (error) {
      return res.status(400).json({ error: 'Hubo un error' });
    }
  }
}

