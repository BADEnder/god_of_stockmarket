// const pgConfig = require('../database/pgConfig')
// const checkSQLInjection = require('../database/checkSQLInjection')
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises

const https = require('https')
const axios = require('axios')

const date_fns = require('date-fns')


const getDataFromOpenSite = async (req, res) => {
    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }
        res.status(200).json(result)
    } catch (err) {
        console.error(err.name)
    }


}

const desideWebsiteCore = async(data) => {
    try {

        const result = data.filter((val) => {
            return Number(val.TradeVolume) > 10**7 && Number(val.ClosingPrice < 100**1)
        })
        console.log('data.length', data.length)
        console.log('result.length', result.length)

        // console.log('result:\n', result)
    
    
        const today = date_fns.format(new Date(), 'yyyyMMdd')
        const fileDirectory = path.join(__dirname, '..', 'data', `result_${today}`)
    
        if (!fs.existsSync(fileDirectory)) {
            await fsPromise.mkdir(fileDirectory)
        }
    
        // console.log('fileDirectory', fileDirectory)


        // const filename = path.join(fileDirectory, 'master.json')
        const filename_all_data = path.join(__dirname, '..', 'data', `result_${today}`, 'all_data.json')
        
        await fsPromise.writeFile(filename_all_data, JSON.stringify(data, null, 4))

        const filename_master = path.join(fileDirectory, 'master.json')
        await fsPromise.writeFile(filename_master, JSON.stringify(result, null, 4))

    } catch (err) {
        console.error(err.name)
        // res.status(500).json({msg: 'Fail!'})

    }
}

const postDataFromOpenSite = async(req, res) => {

    const target_api = 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'

    try {
        const axios_get_res = await axios.get(target_api)
        // console.log(axios_get_res.data)
        desideWebsiteCore(axios_get_res.data)
        res.status(200).json({msg: 'Succsss!'})

    } catch (err) {
        console.error(err.name)
        res.status(500).json({msg: 'Fail!'})

    }



}

module.exports = {
    getDataFromOpenSite,
    postDataFromOpenSite
}