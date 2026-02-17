import express from 'express'
import { loggerMiddleware } from './logger/logger.js'
import { productsRouter } from './controllers/products.controller.js'

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use('/api/products', productsRouter)

export default app
