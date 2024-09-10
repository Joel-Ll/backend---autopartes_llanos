
import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authenticate } from "../middleware/auth";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { normalizeName } from "../helpers";

const router = Router();

router.get('/filtered/:term?',
  authenticate,
  handleInputErrors,
  CategoryController.getCategories
);

router.get('/detail/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  CategoryController.findOneCategory
);

router.get('/selected', 
  authenticate,
  CategoryController.selectedCategory
)

router.post('/',
  authenticate,
  body('name').custom((value) => {
    if (normalizeName(value) === null) {
      throw new Error('El nombre de la categoría no puede estar vacío o ser solo espacios en blanco.');
    }
    return true;
  }),
  handleInputErrors,
  CategoryController.createCategory
);

router.put('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  handleInputErrors,
  CategoryController.updateCategory
);

router.delete('/:id',
  authenticate,
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  CategoryController.deleteCategory
);


export default router;