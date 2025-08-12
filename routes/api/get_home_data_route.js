const express = require('express')
const path = require('path')

const router = express.Router()

const get_home_data_controller = require('../../controllers/get_home_data_controller')

router.route('/')
    .get(get_home_data_controller.get_home_data)
    .post(get_home_data_controller.post_home_data)

module.exports = router