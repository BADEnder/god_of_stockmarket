// const pgConfig = require('../database/pgConfig')
// const checkSQLInjection = require('../database/checkSQLInjection')
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')
const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')

const getOtherInfoForStockMarket = async (req, res) => {

    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }
        res.status(200).json(result)
    } catch (err) {
        console.error(err.name)
    }

}

const postOtherInfoForStockMarket = async(req, res) => {

    try {
        console.log('here you go')
        let stock_id_sets = req.query.stock_id || req.body.stock_id
        let result = []
        // stock_id_sets = checkout_stock_id_type_and_filter_repeat(stock_id_sets)

        console.log('stock_id_sets:\n',stock_id_sets)
        console.log('stock_id_sets.length:\n',stock_id_sets.length)
        console.log('typeof(stock_id_sets):\n',typeof(stock_id_sets))
        for (let stock_id of stock_id_sets) {
            console.log('stock_id:\n',stock_id)

            const today = dateFns.format(new Date(), 'yyyyMMdd')
            const filename = path.join(__dirname, '..', 'data', `real_data_${today}`, 'all_data.json')
        
            // console.log('filename:\n',filename)
            let data = await fsPromise.readFile(filename, 'utf-8')
            data = JSON.parse(data)
        
        
            data = data.filter(val => {return stock_id == val['Code']})

            if (data.length == 1) {
                result.push(data[0])
            } else {
                result.push({
                    stock_id: stock_id,
                    stock_name: 'UNKNOWN'
                })
            }
            
        }


        res.status(200).json(result)

    } catch (err) {
        console.error(err.name)
        console.log(err.msg)
    }

}

module.exports = {
    getOtherInfoForStockMarket,
    postOtherInfoForStockMarket
}