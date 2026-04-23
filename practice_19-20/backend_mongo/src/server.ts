import { app } from './app/app'
import { connectDB } from './config/db'

const PORT = process.env.PORT || 3000

export const startServer = async () => {
	connectDB().then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`)
		})
	})
}
