import { Request, Response } from 'express';
import Supplier, { ISupplier } from '../models/Supplier';
import { SortOrder } from 'mongoose';
import { escapeRegex } from '../helpers';

export class SupplierController {

  static getSuppliers = async (req: Request, res: Response) => {
    try {
      const {term} = req.params;
      let suppliers: ISupplier[];
      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 };
      if (term) {
        const escapedTerm = escapeRegex(term);
        const regex = new RegExp(escapedTerm, 'i');
        suppliers = await Supplier.find({
          $or: [
            { name: { $regex: regex } },
            { email: { $regex: regex } },
          ]
        }).sort(sortCriteria);
      } else {
        suppliers = await Supplier.find({}).sort(sortCriteria);
      }
      return res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error en el servidor'}); 
    }

  }

  static getSupplier = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);
      if (!supplier) {
        const error = new Error('No hay registros');
        return res.status(404).json({ error: error.message });
      }
      return res.status(200).json(supplier);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error en el servidor'}); 
    }
  }

  static selectedSupplier = async (req: Request, res: Response) => {
    try {
      const selectSupplier: ISupplier[] = await Supplier.find({});
      const suppliers = selectSupplier.map(supplier => {
        const data = { name: supplier.name }
        return data;
      });
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static createSupplier = async (req: Request, res: Response) => {
    try {
      const { name, email, phone, address } = req.body;

      const supplierExist = await Supplier.findOne({ email });

      if (supplierExist) {
        return res.status(409).json({ error: `El email: ${email} ya está registrado`});
      }

      const newSupplier = new Supplier({ name, email, phone, address });
      await newSupplier.save();

      return res.status(201).send('Proveedor registrado correctamente');
      
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
  }

  static updateSupplier = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const supplier = await Supplier.findById(id);
      if (!supplier) {
        const error = new Error('Proveedor no encontrado');
        return res.status(404).json({ error: error.message });
      }

      supplier.name = name;
      supplier.email = email;
      supplier.phone = phone;
      supplier.address = address;

      await supplier.save();
      return res.status(200).send('Proveedor actualizado correctamente');
    } catch (error) {
      res.status(400).json({ error: 'El email proporcionado ya está registrado'});
    }
  }

  static deleteSupplier = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);
      if (!supplier) {
        const error = new Error('Proveedor no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await supplier.deleteOne();
      return res.status(200).send('Proveedor eliminado correctamente');
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
  }
}