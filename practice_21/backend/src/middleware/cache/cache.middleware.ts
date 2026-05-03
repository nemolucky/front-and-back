import { NextFunction, Request, Response } from 'express'
import { getFromCache } from '../../cache/cache.service.js'

type CacheKeyBuilder = (req: Request) => string

export function cacheMiddleware(keyBuilder: CacheKeyBuilder) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const key = keyBuilder(req)

		const cachedData = await getFromCache<unknown>(key)
		if (cachedData) {
			return res.status(200).json({
				source: 'cache',
				data: cachedData,
			})
		}

		res.locals.cacheKey = key
		next()
	}
}
