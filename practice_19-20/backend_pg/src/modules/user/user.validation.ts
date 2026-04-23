import { NextFunction, Request, Response } from 'express'
import { CreateUserBodyDto, UpdateUserBodyDto } from './user.dto'

const isNonEmptyString = (value: unknown): value is string => {
	return typeof value === 'string' && value.trim().length > 0
}

const parseUserId = (value: unknown) => {
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed <= 0) {
		return null
	}
	return parsed
}

const parseAge = (value: unknown) => {
	if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
		return null
	}
	return value
}

export const validateCreateUserDto = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { first_name, last_name, age } = req.body as Partial<CreateUserBodyDto>

	if (!isNonEmptyString(first_name)) {
		return res
			.status(400)
			.json({ message: 'first_name must be a non-empty string' })
	}

	if (!isNonEmptyString(last_name)) {
		return res
			.status(400)
			.json({ message: 'last_name must be a non-empty string' })
	}

	const parsedAge = parseAge(age)
	if (parsedAge === null) {
		return res
			.status(400)
			.json({ message: 'age must be a non-negative integer' })
	}

	req.body = {
		first_name: first_name.trim(),
		last_name: last_name.trim(),
		age: parsedAge,
	}

	next()
}

export const validateUpdateUserDto = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { first_name, last_name, age } = req.body as Partial<UpdateUserBodyDto>

	if (!isNonEmptyString(first_name)) {
		return res
			.status(400)
			.json({ message: 'first_name must be a non-empty string' })
	}

	if (!isNonEmptyString(last_name)) {
		return res
			.status(400)
			.json({ message: 'last_name must be a non-empty string' })
	}

	const parsedAge = parseAge(age)
	if (parsedAge === null) {
		return res
			.status(400)
			.json({ message: 'age must be a non-negative integer' })
	}

	req.body = {
		first_name: first_name.trim(),
		last_name: last_name.trim(),
		age: parsedAge,
	}

	next()
}

export const validateUserIdParams = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const parsedId = parseUserId(req.params.id)

	if (parsedId === null) {
		return res.status(400).json({ message: 'id must be a positive integer' })
	}

	req.params.id = String(parsedId)

	next()
}
