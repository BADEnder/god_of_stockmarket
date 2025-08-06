const express = require('express')
const path = require('path')

const router = express.Router()

const get_trend_data_controller = require('../../controllers/get_trend_data_controller')

router.route('/')
    .get(get_trend_data_controller.getStockMartketData)
    .post(get_trend_data_controller.postStockMartketData)

module.exports = router