const express = require('express')
const path = require('path')

const router = express.Router()

const historyDataController = require('../../controllers/historyDataController')

router.route('/')
    .get(historyDataController.gitHistoryDataController)
    .post(historyDataController.postHistoryDataController)

module.exports = router