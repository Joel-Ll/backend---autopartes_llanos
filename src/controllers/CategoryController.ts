import type { Request, Response } from 'express';
import { normalizeName } from '../helpers';
import Category, { ICategory } from '../models/Category';
import { SortOrder } from 'mongoose';

export class CategoryController {

  static getCategories = async (req: Request, res: Response) => {
    try {
      const { term } = req.params;

      let categories: ICategory[];
      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 }; 

      if (term) {
        const regex = new RegExp(term, 'i');
        categories = await Category.find({
          $or: [
            { name: { $regex: regex } },
            { nit_ci: { $regex: regex } },
          ]
        }).sort(sortCriteria);
      } else {
        categories = await Category.find({}).sort(sortCriteria);
      }

      return res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static findOneCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        const error = new Error('No hay registros');
        return res.status(404).json({ error: error.message });
      }
      return res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }


  static createCategory = async (req: Request, res: Response) => {
    try {
      const { name} = req.body;
      const normalizedName = normalizeName(name);

      if (!normalizedName) {
        return res.status(400).json({ error: 'El nombre de la categoría no puede estar vacío.' });
      }

      const categoryExists = await Category.findOne({name: normalizedName});
      if(categoryExists) {
        const error = new Error(`La categoría ${normalizedName} ya existe`);
        return res.status(409).json({error: error.message});
      }

      const newCategory = new Category({
        name: normalizedName
      });
      
      await newCategory.save();
      return res.status(201).send('Categoría creada correctamente');
    } catch (error) {
      res.status(500).json({error: 'Hubo un error'});
    }
  }

  static updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const normalizedName = normalizeName(name);

      const category = await Category.findById(id);
      if (!category) {
        const error = new Error('Categoría no encontrada');
        return res.status(404).json({ error: error.message });
      }

      category.name = normalizedName;
      await category.save();
      return res.status(200).send('Categoría actualizada correctamente');
    } catch (error) {
      res.status(400).json({ error: `La categoría ${normalizeName} ya esta registrada`});
    }
  }

  static deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        const error = new Error('Categoría no encontrada');
        return res.status(404).json({ error: error.message });
      }
      await category.deleteOne();
      return res.status(200).send('Categoría eliminada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
}