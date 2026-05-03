import { Request, Response, NextFunction } from 'express'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

function validationMiddleware<T extends object>(
	dtoClass: new () => T,
): (req: Request, res: Response, next: NextFunction) => void {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dtoInstance = plainToClass(dtoClass, req.body)

		const errors: ValidationError[] = await validate(dtoInstance)

		if (errors.length > 0) {
			const validationErrors = errors
				.map(error => Object.values(error.constraints || {}))
				.flat()

			return res.status(400).json({
				message: 'Ошибка валидации',
				errors: validationErrors,
			})
		}

		req.body = dtoInstance
		next()
	}
}

export default validationMiddleware
