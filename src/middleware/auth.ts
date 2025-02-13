import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  const wordSecret = process.env.JWT_SECRET;
  if(!bearer) {
    const error = new Error('No Autorizado');
    return res.status(401).json({error: error.message});
  }

  const token = bearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, wordSecret);
    if(typeof decoded === 'object' && decoded.id) {
      const user = await User.findById(decoded.id);
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(500).json({error: 'Token no válido'})    
      }
    }
  } catch (error) {
    res.status(500).json({error: 'Token no válido'})   
  }
}