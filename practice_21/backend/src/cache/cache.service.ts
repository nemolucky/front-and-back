import { getRedisClient, redisAvailable } from './redis.js'

export const USERS_CACHE_TTL_SEC = 60
export const PRODUCTS_CACHE_TTL_SEC = 600

export async function getFromCache<T>(key: string) {
	if (!redisAvailable()) {
		return null
	}

	try {
		const raw = await getRedisClient().get(key)
		if (!raw) {
			return null
		}

		return JSON.parse(raw) as T
	} catch (err) {
		console.error('Cache read error:', err)
		return null
	}
}

export async function saveToCache(key: string, data: unknown, ttlSec: number) {
	if (!redisAvailable()) {
		return
	}

	try {
		await getRedisClient().set(key, JSON.stringify(data), { EX: ttlSec })
	} catch (err) {
		console.error('Cache save error:', err)
	}
}

export async function invalidateUsersCache(userId?: string) {
	if (!redisAvailable()) {
		return
	}

	const keys = ['users:all']
	if (userId) {
		keys.push(`users:${userId}`)
	}

	try {
		await getRedisClient().del(keys)
	} catch (err) {
		console.error('Users cache invalidate error:', err)
	}
}

export async function invalidateProductsCache(productId?: string) {
	if (!redisAvailable()) {
		return
	}

	const keys = ['products:all']
	if (productId) {
		keys.push(`products:${productId}`)
	}

	try {
		await getRedisClient().del(keys)
	} catch (err) {
		console.error('Products cache invalidate error:', err)
	}
}
