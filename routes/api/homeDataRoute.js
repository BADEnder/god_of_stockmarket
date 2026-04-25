const express = require('express')
const path = require('path')

const router = express.Router()

const homeDataController = require('../../controllers/homeDataController')

router.route('/')
    .get(homeDataController.get_home_data)
    .post(homeDataController.post_home_data)

module.exports = router