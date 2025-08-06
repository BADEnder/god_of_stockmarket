const express = require('express')
const path = require('path')
const router = express.Router()

const get_probability_data_controller = require('../../controllers/get_probability_data_controller')

router.route('/')
    .get(get_probability_data_controller.get_probability_data)
    .post(get_probability_data_controller.post_probibility_data)


module.exports = router