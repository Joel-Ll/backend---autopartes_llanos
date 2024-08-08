import type { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import Customer, { ICustomer } from '../models/Customer';

export class CustomerController {

  static getCustomers = async (req: Request, res: Response) => {
    try {
      const { term } = req.params;

      let customers: ICustomer[];
      const sortCriteria: { [key: string]: SortOrder } = { createdAt: -1 }; // Orden descendente

      if (term) {
        const regex = new RegExp(term, 'i');
        customers = await Customer.find({
          $or: [
            { name: { $regex: regex } },
            { nit_ci: { $regex: regex } },
          ]
        }).sort(sortCriteria);
      } else {
        customers = await Customer.find({}).sort(sortCriteria);
      }

      return res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error en el servidor'});
    }
  }

  static findOneCustomer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
      if (!customer) {
        const error = new Error('No hay registros');
        return res.status(404).json({ error: error.message });
      }
      return res.status(200).json(customer);

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }

  static createCustomer = async (req: Request, res: Response) => {
    try {
      const { name, nit_ci, phone, address } = req.body;

      const customerExist = await Customer.findOne({ nit_ci });

      if (customerExist) {
        return res.status(409).json({ error: `El cliente con el CI/NIT: ${nit_ci} ya se encuentra registrado` });
      }

      const newCustomer = new Customer({ name, nit_ci, phone, address });
      await newCustomer.save();

      return res.status(201).send('Cliente registrado correctamente');
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
  }

  static updateCustomer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, nit_ci, phone, address } = req.body;

      const customer = await Customer.findById(id);
      if (!customer) {
        const error = new Error('Cliente no encontrado');
        return res.status(404).json({ error: error.message });
      }

      customer.name = name;
      customer.nit_ci = nit_ci;
      customer.phone = phone;
      customer.address = address;

      await customer.save();

      return res.status(200).send('Cliente actualizado correctamente');
    } catch (error) {
      res.status(400).json({ error: 'El NIT/CI proporcionado ya está registrado' });
    }
  }

  static deleteCustomer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
      if (!customer) {
        const error = new Error('Cliente no encontrado');
        return res.status(404).json({ error: error.message });
      }
      await customer.deleteOne();
      return res.status(200).send('Cliente eliminado correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
}
