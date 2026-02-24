import express from 'express'
import cors from 'cors'
import productsRouter from './modules/products/products.routes.js'
import { loggerMiddleware } from './middleware/logger.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const app = express()

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Products API',
			version: '1.0.0',
			description: 'API for managing products',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local server',
			},
		],
	},
	apis: ['./src/docs/**.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
