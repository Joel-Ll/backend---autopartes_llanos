import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticate } from '../middleware/auth';
import { body, param, query } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/filtered-product',
  body('code').notEmpty().withMessage('El campo código es obligatorio'),
  handleInputErrors,
  ProductController.getFilteredProduct
)

router.get('/', 
  query('term').optional().isString(),
  query('status').optional().isString(),
  query('category').optional().isString(),
  handleInputErrors,
  ProductController.getAllProducts
);

router.get('/:idProduct', 
  param('idProduct').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  ProductController.getProduct
)

router.post('/',
  body('category').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('code').notEmpty().withMessage('El código es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  handleInputErrors,
  ProductController.createProduct
);

router.put('/:idProduct',
  param('idProduct').isMongoId().withMessage('Id no válido'),
  body('category').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('code').notEmpty().withMessage('El código es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  handleInputErrors,
  ProductController.updateProduct
);

router.delete('/:idProduct', 
  param('idProduct').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  ProductController.deleteProduct
)

export default router;