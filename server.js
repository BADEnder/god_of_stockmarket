require('dotenv').config()

const path = require('path')

const express = require('express')
const cors = require('cors')

const app = express()
const app_http = express()

// Configuration except for .env
const corsOptions = require('./config/corsOptions')
// const httpsOptions = require('./config/httpsOptions')

// Hostname and Port
const IP = process.env.IP || '127.0.0.1'
const HTTPS_PORT = process.env.HTTPS_PORT || 443 
const HTTP_PORT= process.env.HTTP_PORT || 80

const {logRecord} = require('./middlewares/logMiddleware')
const errorHandler = require('./middlewares/errorHandler')


// Basic middleware from express.js
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(cors(corsOptions))

// First middlewares
app.use(logRecord)

// Websites
app.use('/', require('./routes/homeRoutes'))



// APIs
app.use('/api/getTopInfo', require('./routes/api/getTopInfoRoute'))
app.use('/api/getDataFromOpenSite', require('./routes/api/getDataFromOpenSiteRoute'))
app.use('/api/getStockMarketData', require('./routes/api/getStockMarketDataRoute'))
app.use('/api/getOtherInfoForStockMarket', require('./routes/api/getOtherInfoForStockMarketRoute'))
app.use('/api/pythonExecAPI', require('./routes/api/pythonExecAPIRoute'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({
            msg: '404 Not Found'
        })
    } else {
        res.type('txt').send('404 Not Found')
    }
})


// Error handler
app.use(errorHandler)

// Listening
// Dev deplyment without SSL
app.listen(HTTP_PORT, () => {
    console.log(`Server is running at PORT: ${HTTP_PORT}`)
})

/* 
//  Formal deployment with https if you have SSL certification.
 app_http.all('*', (req, res) => {
     res.redirect(307,`https://${process.env.DOMAIN_NAME}${req.url}`)
 })

 http.createServer(app_http).listen(80, () => {
     console.log(`Server is running at PORT: ${HTTP_PORT}, but it's redirecting to ${HTTPS_PORT}`)
 })

 https.createServer(httpsOptions, app).listen(443, () => {
     console.log(`Server is running at PORT: ${HTTPS_PORT}`)
 })

*/