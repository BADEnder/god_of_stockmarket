const express = require('express')
const path = require('path')

const router = express.Router()

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname,  '..', 'views', 'home.html'))
})

router.get('/stock_price_trend(.html)?', (req, res) => {
    req_query = req.query
    res.sendFile(path.join(__dirname,  '..', 'views', 'stock_price_trend.html'))
})

router.get('/stock_price_probability(.html)?', (req, res) => {
    req_query = req.query
    res.sendFile(path.join(__dirname,  '..', 'views', 'stock_price_probability.html'))
})



module.exports = router