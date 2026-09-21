import { Router } from 'express'
import { createOrder, listOrders } from '../controllers/orderController.js'

const router = Router()
router.get('/', listOrders)
router.post('/', createOrder)
export default router
