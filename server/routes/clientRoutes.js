import { Router } from 'express'
import { createClient, listClients, removeClient, updateClient } from '../controllers/clientController.js'

const router = Router()
router.get('/', listClients)
router.post('/', createClient)
router.patch('/:id', updateClient)
router.delete('/:id', removeClient)
export default router
