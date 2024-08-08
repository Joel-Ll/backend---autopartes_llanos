import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/user', 
  authenticate,
  AuthController.getUser
)

router.post('/login',
  body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
  body('password').notEmpty().withMessage('El password no puede ir vacío'),
  handleInputErrors,
  AuthController.login
);

router.put('/update-profile/:userId', 
  authenticate,
  param('userId').isMongoId().withMessage('ID no valido'),
  body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
  body('current_password').notEmpty().withMessage('La contraseña actual no puede ir vacío'), 
  body('new_password').notEmpty().withMessage('El nueva contraseña no puede ir vacío'), 
  handleInputErrors,
  AuthController.updateProfile
);

export default router;