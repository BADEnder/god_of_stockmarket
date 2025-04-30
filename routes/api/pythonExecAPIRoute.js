const express = require('express')

const router = express.Router()

const pythonExecAPIController = require('../../controllers/pythonExecAPIController')


// const stock_id = '2320'
// exec(`python pyDLmodle/main.py ${stock_id}`)

router.route('/')
    .post(pythonExecAPIController.postToRunModel)

module.exports = router