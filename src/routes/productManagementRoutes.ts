import { Router } from "express";
import { ProductManagementController } from "../controllers/ProductManagementController";
import { authenticate } from "../middleware/auth";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.get('/:term?', 
  handleInputErrors,
  ProductManagementController.getAllProductsManagement
);

router.get('/detail/:id', 
  param('id').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  ProductManagementController.getProductManagement
)

router.post('/', 
  body('productId').isMongoId().withMessage('ID no válido'),
  body('productPrice').notEmpty().withMessage('El precio del producto es obligatorio')
    .isNumeric().withMessage('El precio debe ser un numero')
    .isInt({min: 0}).withMessage('El precio no debe ser un número negativo'),
  handleInputErrors,
  ProductManagementController.createProductManagement
);

router.put('/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  body('productPrice').notEmpty().withMessage('El precio del producto es obligatorio')
    .isNumeric().withMessage('El precio debe ser un numero')
    .isInt({min: 1}).withMessage('El precio debe ser mayor a 0'),
  handleInputErrors,
  ProductManagementController.updateProductManagement
)

router.delete('/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  ProductManagementController.deleteProductManagement
)



export default router;