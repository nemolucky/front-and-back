import { NextFunction, Request, Response } from 'express'
import { UserRole } from '../modules/auth/types/user.interface.js'

export function rolesMiddleware(allowedRoles: UserRole[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				error: 'Forbidden',
			})
		}

		next()
	}
}
