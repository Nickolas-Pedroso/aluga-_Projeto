import { Router } from 'express'
import { createProduct, listProducts, removeProduct, updateProduct } from '../controllers/productController.js'

const router = Router()
router.get('/', listProducts)
router.post('/', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', removeProduct)
export default router
