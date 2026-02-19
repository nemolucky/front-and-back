import express from 'express'
import cors from 'cors'
import productsRouter from './modules/products/products.routes.js'
import { loggerMiddleware } from './middleware/logger.js'

const app = express()

app.use(
	cors({
		origin: 'http://localhost:3001',
		credentials: true,
	}),
)

app.use(express.json())
app.use(loggerMiddleware)
app.use('/api/products', productsRouter)

export default app
