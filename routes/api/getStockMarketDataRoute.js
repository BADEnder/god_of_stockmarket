const express = require('express')
const path = require('path')

const router = express.Router()

const getStockMarketDataController = require('../../controllers/getStockMarketDataController')

router.route('/')
    .get(getStockMarketDataController.getStockMartketData)
    .post(getStockMarketDataController.postStockMartketData)

module.exports = router