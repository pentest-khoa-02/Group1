import pg from 'pg'

const Client = new pg.Client({
    user: "postgres",
    //host: "localhost",
	//Docker
	host: "db",
    password: "postgres",
	port: '5432',
	database: 'social_network',
})

Client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database successfully!!!')
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err)
	})

export default {Client}