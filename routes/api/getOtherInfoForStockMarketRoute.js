const express = require('express')
const path = require('path')

const router = express.Router()

const getOtherInfoForStockMarketController = require('../../controllers/getOtherInfoForStockMarketController')

router.route('/')
    .get(getOtherInfoForStockMarketController.getOtherInfoForStockMarket)
    .post(getOtherInfoForStockMarketController.postOtherInfoForStockMarket)

module.exports = router