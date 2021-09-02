// Importar modulo de express
import { Router } from "express";
const router = Router();

// Importando la logica de productos
import { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/indexControllers';

// Ruta para crear un nuevo producto
router.post('/product', createProduct);
// Ruta para mostrar la lista de productos
router.get('/product', getProducts);
// Ruta para eliminar un producto
router.delete('/product/:id', deleteProduct);
// // Ruta para consultar un producto
// router.get('/product/:id', getProductById);
// Ruta para actualizar un producto
router.put('/product/:id', updateProduct);

export default router;
