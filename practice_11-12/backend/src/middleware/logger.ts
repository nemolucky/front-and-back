import type { NextFunction, Request, Response } from 'express'

export const loggerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const now = new Date().toISOString()

	console.log(`[${now}] ${req.method} ${req.originalUrl}`)
	next()
}
