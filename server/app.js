import express from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { health } from './controllers/healthController.js'

export const app = express()
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '8mb' }))
app.get('/api/health', health)
app.use('/api/products', productRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/uploads', uploadRoutes)
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: error instanceof Error ? error.message : 'Não foi possível concluir a operação.' })
})
