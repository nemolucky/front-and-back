import { createClient, RedisClientType } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

let redisClient: RedisClientType | null = null
let isRedisReady = false

export function getRedisClient() {
	if (!redisClient) {
		redisClient = createClient({ url: REDIS_URL })
		redisClient.on('error', (err: unknown) => {
			isRedisReady = false
			console.error('Redis error:', err)
		})
		redisClient.on('end', () => {
			isRedisReady = false
		})
	}

	return redisClient
}

export async function initRedis() {
	const client = getRedisClient()
	if (client.isOpen || client.isReady) {
		isRedisReady = true
		return
	}

	await client.connect()
	isRedisReady = true
	console.log('Redis connected')
}

export function redisAvailable() {
	const client = getRedisClient()
	return isRedisReady && client.isReady
}
