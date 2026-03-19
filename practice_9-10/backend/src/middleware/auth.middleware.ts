import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

declare global {
	namespace Express {
		interface Request {
			userId?: string
		}
	}
}

dotenv.config()
export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const accessSecret = process.env.ACCESS_JWT_SECRET || process.env.JWT_SECRET || ''
	const header = req.headers.authorization || ''
	const [scheme, token] = header.split(' ')
	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({
			error: 'Missing or invalid Authorization header',
		})
	}
	try {
		const payload = jwt.verify(token, accessSecret)
		if (typeof payload === 'string' || typeof payload.sub !== 'string') {
			return res.status(401).json({
				error: 'Invalid token payload',
			})
		}
		req.userId = payload.sub
		next()
	} catch {
		return res.status(401).json({
			error: 'Invalid or expired token',
		})
	}
}
