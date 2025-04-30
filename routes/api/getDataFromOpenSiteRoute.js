const express = require('express')
const path = require('path')

const router = express.Router()
const getDataFromOpenSite = require('../../controllers/getDataFromOpenSiteController')


router.route('/')
    .get(getDataFromOpenSite.getDataFromOpenSite)
    .post(getDataFromOpenSite.postDataFromOpenSite)

module.exports = router

