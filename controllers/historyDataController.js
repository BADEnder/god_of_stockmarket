const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

const pgConfig = require('../database/pgConfig')
const checkSQLInjection = require('../database/checkSQLInjection')

const getStockMartketData = async (req, res) => {

    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }
        res.status(200).json(result)
    } catch (err) {
        console.error('err.name: ', err.name)
    }

}


const gitHistoryDataController = async (req, res) => {
    
} 
const postHistoryDataController = async(req, res) => {
    let req_content = req.body || req.query
    console.log(req_content)

    let query = 
    `
        SELECT 
            date, 
            stock_id,
            stock_name,
            price_change_ratio,
            close_price,
            trade_volume, 
            buy_volume,
            sell_volume,
            external_ratio
        FROM stock_buy_sell_ratio
        WHERE stock_id = '${req_content.stock_id}'
        AND date >= '${req_content.start_date}'
        AND date <= '${req_content.end_date}'

        ORDER BY stock_id, date DESC
    `
    
    const client = pgConfig()
    await client.connect()
    let pg_result = await client.query(query)
    let result = pg_result.rows
    await client.end()

    for (let row of result) {
        row['date'] = dateFns.format(new Date(row['date']), 'yyyy-MM-dd')
        row['trade_volume'] = (row['trade_volume'] / 1000).toFixed(0)
    }
    res.status(200).json(result)

    // console.log(query)
}

module.exports = {
    gitHistoryDataController,
    postHistoryDataController
}