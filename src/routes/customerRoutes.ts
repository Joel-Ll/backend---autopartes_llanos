import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate } from '../middleware/auth';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.get('/:term?',
  authenticate,
  handleInputErrors,
  CustomerController.getCustomers
);

router.get('/detail/:id', 
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  CustomerController.findOneCustomer
);


router.post('/',
  authenticate,
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('nit_ci').notEmpty().withMessage('El nit_ci es obligatorio'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
  body('address').notEmpty().withMessage('La dirección es obligatorio'),
  handleInputErrors,
  CustomerController.createCustomer
);

router.put('/:id', 
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('nit_ci').notEmpty().withMessage('El nit_ci es obligatorio'),
  body('phone').notEmpty().withMessage('El teléfono es obligatorio'),
  body('address').notEmpty().withMessage('La dirección es obligatorio'),
  handleInputErrors,
  CustomerController.updateCustomer
);

router.delete('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  CustomerController.deleteCustomer
);

export default router