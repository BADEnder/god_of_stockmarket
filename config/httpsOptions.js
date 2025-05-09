require('dotenv').config()
const fs = require('fs')

const HTTPS_options = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT)
}

module.exports = HTTPS_options