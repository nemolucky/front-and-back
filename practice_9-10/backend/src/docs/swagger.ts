// config/swagger.config.ts
import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Products API',
			version: '1.0.0',
			description: 'API for managing products',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Local server',
			},
		],
		components: {
			schemas: {
				// Auth schemas
				UserLoginDto: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: {
							type: 'string',
							format: 'email',
						},
						password: {
							type: 'string',
							minLength: 8,
						},
					},
				},
				UserRegisterDto: {
					allOf: [
						{ $ref: '#/components/schemas/UserLoginDto' },
						{
							type: 'object',
							required: ['firstName', 'lastName'],
							properties: {
								firstName: {
									type: 'string',
									minLength: 3,
								},
								lastName: {
									type: 'string',
									minLength: 3,
								},
							},
						},
					],
				},
				AuthResponse: {
					type: 'object',
					required: ['accessToken', 'refreshToken'],
					properties: {
						accessToken: {
							type: 'string',
						},
						refreshToken: {
							type: 'string',
						},
					},
				},
				// Product schemas
				Product: {
					type: 'object',
					required: [
						'title',
						'description',
						'category',
						'price',
						'leftInStock',
					],
					properties: {
						id: {
							type: 'string',
							readOnly: true,
						},
						title: {
							type: 'string',
						},
						description: {
							type: 'string',
						},
						category: {
							type: 'string',
							enum: ['ELECTRONICS', 'FOOD', 'CLOTHING', 'OTHER'],
						},
						price: {
							type: 'number',
						},
						leftInStock: {
							type: 'number',
						},
					},
				},
				UpdateProduct: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
						},
						description: {
							type: 'string',
						},
						category: {
							type: 'string',
							enum: ['ELECTRONICS', 'FOOD', 'CLOTHING', 'OTHER'],
						},
						price: {
							type: 'number',
						},
						leftInStock: {
							type: 'number',
						},
					},
				},
				ErrorResponse: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
						},
					},
				},
			},
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: ['./src/docs/**.ts'],
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
