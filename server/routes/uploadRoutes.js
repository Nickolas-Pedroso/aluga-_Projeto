import { Router } from 'express'
import { uploadImage, uploadRemote } from '../controllers/uploadController.js'

const router = Router()
router.post('/', uploadImage)
router.post('/remote', uploadRemote)
export default router
