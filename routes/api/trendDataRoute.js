const express = require('express')
const path = require('path')

const router = express.Router()

const trendDataController = require('../../controllers/trendDataController')

router.route('/')
    .get(trendDataController.getStockMartketData)
    .post(trendDataController.postStockMartketData)

module.exports = router