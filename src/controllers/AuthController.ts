import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/jwt';

export class AuthController {

  static getUser = (req: Request, res: Response) => {
    return res.json(req.user.name);
  }

  static login = async (req: Request, res: Response) => {
    try {
      let { name, password } = req.body;
      name = String(name).toLowerCase();

      const user = await User.findOne({ name });
      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(401).json({ error: error.message });
      }

      // Revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error('Contraseña Incorrecta');
        return res.status(401).json({ error: error.message });
      }
      const token = generateJWT({id: user.id});
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }


  static updateProfile = async (req: Request, res: Response) => {
    try {
      const { name, current_password, new_password } = req.body;
      const isCorrectPassword = await checkPassword(current_password, req.user.password);

      if (!isCorrectPassword) {
        const error = new Error('La constraseña actual es incorrecta');
        return res.status(404).json({ error: error.message });
      }

      const hashedNewPassword = await hashPassword(new_password);
      req.user.name = name
      req.user.password = hashedNewPassword;
      await req.user.save();
      res.send('Perfil actualizado correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  }
}