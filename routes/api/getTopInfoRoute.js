const express = require('express')
const path = require('path')

const router = express.Router()

const getTopInfoController = require('../../controllers/getTopInfoController')

router.route('/')
    .get(getTopInfoController.getTopInfo)

module.exports = router