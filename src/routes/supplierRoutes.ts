import {Router} from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { authenticate } from '../middleware/auth';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.get('/:term?',
  authenticate,
  handleInputErrors,
  SupplierController.getSuppliers
);

router.get('/detail/:id', 
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  SupplierController.getSupplier
);

router.post('/',
  authenticate,
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
  body('address').notEmpty().withMessage('La dirección es obligatorio'),
  handleInputErrors,
  SupplierController.createSupplier
);

router.put('/:id', 
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
  body('address').notEmpty().withMessage('La dirección es obligatorio'),
  handleInputErrors,
  SupplierController.updateSupplier
);

router.delete('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  SupplierController.deleteSupplier
);

export default router;