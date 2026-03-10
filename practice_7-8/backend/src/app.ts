import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import productsRouter from './modules/products/products.routes.js'
import authRouter from './modules/auth/auth.routes.js'
import { loggerMiddleware } from './middleware/logger.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerSpec } from './docs/swagger.js'

const app = express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(
	cors({
		origin: 'http://localhost:3001',
		credentials: true,
	}),
)

app.use(express.json())
app.use(loggerMiddleware)
app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)

export default app
