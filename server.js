require('dotenv').config()
const { Pool } = require('pg')
const express = require('express')
const compression = require('compression')
const app = express()
const PORT = process.env.PORT || 5000

app.use(compression())

// Подключение к базе данных PostgreSQL
const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
})

// Создание таблицы и вставка примерных данных
pool.query(
	`CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title TEXT,
    img TEXT,
    description TEXT,
    category TEXT,
    price INTEGER
  )`,
	(err, res) => {
		if (err) {
			console.error('Error creating table:', err)
		} else {
			console.log('Table "items" created successfully')

			// Проверка, были ли уже вставлены данные
			pool.query('SELECT COUNT(*) FROM items', (err, result) => {
				if (err) {
					console.error('Error checking existing data:', err)
					return
				}

				const rowCount = parseInt(result.rows[0].count)
				if (rowCount === 0) {
					// Вставка данных только если таблица пуста
					const items = [
						{
							id: 1,
							image: item1,
							name: 'Мышь',
							price: 10000,
						},
						{
							id: 2,
							image: item2,
							name: 'Мышь',
							price: 5000,
						},
						{
							id: 3,
							image: item3,
							name: 'Macbook',
							price: 3000,
						},
						{
							id: 4,
							image: item4,
							name: 'iMac',
							price: 25000,
						},
						{
							id: 5,
							image: item5,
							name: 'iMac',
							price: 7000,
						},
						{
							id: 6,
							image: item6,
							name: 'Клавиатура',
							price: 50000,
						},
						{
							id: 7,
							image: item7,
							name: 'Клавиатура',
							price: 5000,
						},
						{
							id: 8,
							image: item8,
							name: 'RX 3090',
							price: 12000,
						},
						{
							id: 9,
							image: item9,
							name: 'GTX 1070',
							price: 13000,
						},
					]

					items.forEach(item => {
						pool.query(
							`INSERT INTO items (title, img, description, category, price)
               VALUES ($1, $2, $3, $4, $5)`,
							item,
							(err, res) => {
								if (err) {
									console.error('Error inserting item:', err)
								} else {
									console.log('Item inserted successfully')
								}
							}
						)
					})
					const fs = require('fs')

					fs.readFile('update_items.sql', 'utf8', (err, data) => {
						if (err) {
							console.error('Error reading SQL script:', err)
							return
						}

						pool.query(data, (err, result) => {
							if (err) {
								console.error('Error executing SQL script:', err)
							} else {
								console.log('SQL script executed successfully')
							}
						})
					})
				}
			})
		}
	}
)

// Определение конечных точек API
app.get('/api/items', (req, res) => {
	pool.query(
		'SELECT id, title, img, description, category, price FROM items',
		(err, result) => {
			if (err) {
				res.status(500).json({ error: err.message })
				return
			}
			console.log('Retrieved items with description:', result.rows)
			res.json(result.rows)
		}
	)
})

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})
