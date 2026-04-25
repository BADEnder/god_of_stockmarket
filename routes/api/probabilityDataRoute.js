const express = require('express')
const path = require('path')
const router = express.Router()

const probabilityDataController = require('../../controllers/probabilityDataController')

router.route('/')
    .get(probabilityDataController.get_probability_data)
    .post(probabilityDataController.post_probibility_data)


module.exports = router