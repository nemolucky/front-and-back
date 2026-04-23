import { pool } from '../../config/db'
import { CreateUserBodyDto, UpdateUserBodyDto } from './user.dto'
import { User } from './user.types'

export const createUser = async (data: CreateUserBodyDto): Promise<User> => {
	const result = await pool.query(
		`INSERT INTO users(first_name, last_name, age)
     VALUES($1, $2, $3)
     RETURNING *`,
		[data.first_name, data.last_name, data.age],
	)
	return result.rows[0]
}

export const getUsers = async (): Promise<User[]> => {
	const result = await pool.query(`SELECT * FROM users ORDER BY id`)
	return result.rows
}

export const getUserById = async (id: number): Promise<User | undefined> => {
	const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
	return result.rows[0]
}

export const updateUser = async (
	id: number,
	data: UpdateUserBodyDto,
): Promise<User | undefined> => {
	const result = await pool.query(
		`UPDATE users
     SET first_name = $1,
         last_name = $2,
         age = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
		[data.first_name, data.last_name, data.age, id],
	)
	return result.rows[0]
}

export const deleteUser = async (id: number): Promise<User | undefined> => {
	const result = await pool.query(
		`DELETE FROM users WHERE id = $1 RETURNING *`,
		[id],
	)
	return result.rows[0]
}
