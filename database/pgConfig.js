require('dotenv').config()
const {Client} = require('pg')

const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    post: process.env.DB_PORT || 5432,
    user:  process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || '',
    database: process.env.DB_DB || 'postgres'
}

const main = () => {
    return new Client(config)
}

module.exports = main


