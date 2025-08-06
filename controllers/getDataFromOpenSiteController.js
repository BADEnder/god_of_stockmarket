const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
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

const checkDigit = (word) => {
    for (let char of word) {
        if (String(Number(char)) != char) {
            return false
        }
    } 
    return true
}

const desideWebsiteCore = async(data) => {
    try {

        let result = data.filter((val) => {
            return Number(val.TradeVolume) >= 10**7 && checkDigit(val.Code)
        })

    
    
        const today = date_fns.format(new Date(), 'yyyyMMdd')
        
        const rootDirectory = path.join(__dirname, '..', 'data')
        const fileDirectory = path.join(__dirname, '..', 'data', `real_data_${today}`)
        
        if (!fs.existsSync(rootDirectory)) {
            await fsPromise.mkdir(rootDirectory)
        }

        if (!fs.existsSync(fileDirectory)) {
            await fsPromise.mkdir(fileDirectory)
        }
    
        const filename_all_data = path.join(__dirname, '..', 'data', `real_data_${today}`, 'all_data.json')
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
        await desideWebsiteCore(axios_get_res.data)
        res.status(200).json({msg: 'postDataFromOpenSite Succsss!'})

    } catch (err) {
        console.error(err.name)
        res.status(500).json({msg: 'postDataFromOpenSite Fail!'})

    }



}

module.exports = {
    getDataFromOpenSite,
    postDataFromOpenSite
}