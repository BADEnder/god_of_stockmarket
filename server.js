require('dotenv').config()

const path = require('path')

const express = require('express')

const app = express()

const PORT = 80

const {logRecord} = require('./middlewares/logMiddleware')


// Basic middleware from express.js
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))

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


// Dev deplyment without SSL
app.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`)
})
