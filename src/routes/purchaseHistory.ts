import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { PurcheProductController } from "../controllers/PurchaseHistoryController";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.use(authenticate);

router.get('/',
  query('term').optional().isString(),
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida'),
  handleInputErrors,
  PurcheProductController.getAllPurchaseHistory
);

router.get('/:id', 
  param('id').isMongoId().withMessage('Id no válido'),
  handleInputErrors,
  PurcheProductController.getPurchaseProduct
)

router.post('/',
  body('idProductManagement').isMongoId().withMessage('ID no válido'),
  body('nameSupplier').notEmpty().withMessage('El nombre del proveedor es obligatorio'),
  body('codeProduct').notEmpty().withMessage('El codigo de producto es obligatorio'),
  body('unitQuantity').notEmpty().withMessage('La cantidad unitaria es obligaotorio')
    .isNumeric().withMessage('La cantidad unitaria debe ser un numero')
    .isInt({ min: 1 }).withMessage('La cantidad unitaria debe ser mayor a 0'),
  body('purchasePrice').notEmpty().withMessage('El precio de compra es obligatorio')
    .isNumeric().withMessage('El precio de compra debe ser un numero')
    .isInt({ min: 1 }).withMessage('El precio de compra debe ser mayor a 0'),
  body('purchaseDesc').notEmpty().withMessage('La descripcion de compra es obligagoria'),
  handleInputErrors,
  PurcheProductController.createPurchaseHistoryProduct
);

router.delete('/:id', 
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  PurcheProductController.deletePurchaseHistory
)

export default router;