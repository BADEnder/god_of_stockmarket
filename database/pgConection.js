const pgConfig = require('./pgConfig')

// This module is for no need to get response
// ex: const res = await client.query(query)

const main = async (query) => {
    const client = pgConfig()

    await client.connect()
    await client.query(query)
    await client.end()
}

module.exports = main