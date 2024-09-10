import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { SaleController } from "../controllers/SaleController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.post('/',
  body('nameCustomer').optional().isString().withMessage('El nombre del cliente debe ser un texto'),
  body('products').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un producto'),
  body('products.*.idProduct').isMongoId().withMessage('ID de producto no válido'),
  body('products.*.nameProduct').isString().withMessage('El nombre del producto debe ser un texto'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo'),
  body('products.*.unitPrice').isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
  body('products.*.subtotal').isFloat({ min: 0 }).withMessage('El subtotal debe ser un número positivo'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('El precio total debe ser un número positivo'),
  body('description').optional().isString().withMessage('La descripción debe ser un texto'),
  handleInputErrors,
  SaleController.createSale
);

router.get('/',
  SaleController.getAllSales
)

router.get('/detail/:idSale',
  param('idSale').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  SaleController.getSale
)

router.delete('/:idSale', 
  param('idSale').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  SaleController.deleteSale
)


export default router