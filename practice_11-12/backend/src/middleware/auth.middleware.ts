import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UserRole, USERS } from '../modules/auth/types/user.interface.js'

type AuthPayload = {
	id: string
	role: UserRole
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthPayload
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
		if (
			typeof payload === 'string' ||
			typeof payload.sub !== 'string' ||
			typeof payload.role !== 'string'
		) {
			return res.status(401).json({
				error: 'Invalid token payload',
			})
		}

		const user = USERS.find(item => item.id === payload.sub)
		if (!user || user.isBlocked) {
			return res.status(401).json({
				error: 'User is blocked or not found',
			})
		}

		req.user = {
			id: user.id,
			role: user.role,
		}
		next()
	} catch {
		return res.status(401).json({
			error: 'Invalid or expired token',
		})
	}
}
