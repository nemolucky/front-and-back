const express = require('express')

const app = express()
const port = Number(process.env.PORT || 3000)
const instance = process.env.INSTANCE_NAME || `backend-${port}`

app.get('/', (_req, res) => {
	res.json({
		message: 'Response from backend server',
		instance,
		port,
		hostname: process.env.HOSTNAME || null,
		timestamp: new Date().toISOString(),
	})
})

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok', instance })
})

app.listen(port, () => {
	console.log(`Server ${instance} started on port ${port}`)
})
