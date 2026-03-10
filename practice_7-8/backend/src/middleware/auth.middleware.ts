import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

declare global {
	namespace Express {
		interface Request {
			userId?: string | JwtPayload
		}
	}
}

dotenv.config()
export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const header = req.headers.authorization || ''
	const [scheme, token] = header.split(' ')
	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({
			error: 'Missing or invalid Authorization header',
		})
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || '')
		req.userId = payload
		next()
	} catch (err) {
		return res.status(401).json({
			error: 'Invalid or expired token',
		})
	}
}
