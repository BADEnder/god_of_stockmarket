require('dotenv').config()

const whitelist = [
    'https://127.0.0.1', 
    'http://127.0.0.1',
    'http://127.0.0.1:3500',
    'https://localhost', 
    'http://localhost',
]

if(process.env.DOMAIN_NAME) {
    whitelist.push(`https://${process.env.DOMAIN_NAME}`)
    whitelist.push(`http://${process.env.DOMAIN_NAME}`)
}

if(process.env.IP) {
    whitelist.push(`https://${process.env.IP}`)
    whitelist.push(`http://${process.env.IP}`)
}

const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionSuccessStatus: 200
}


module.exports = corsOptions