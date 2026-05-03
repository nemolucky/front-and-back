import app from './app.js'
import { initRedis } from './cache/redis.js'

const PORT = 3000

async function bootstrap() {
	try {
		await initRedis()
	} catch (error) {
		console.error(
			'Redis is not available. Server will continue without cache.',
			error,
		)
	}

	app.listen(PORT, () => {
		console.log(`Server started on http://localhost:${PORT}`)
	})
}

void bootstrap()
