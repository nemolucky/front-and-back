import express from 'express'
import routes from './routes'
import loggerMiddleware from '../shared/middleware/logger.middleware'

export const app = express()

app.use(express.json())
app.use(loggerMiddleware)

app.use('/api', routes)
