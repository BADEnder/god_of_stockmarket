const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')
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


const handle_stock_id_to_data = async (req_content, res) => {
    try {
        req_content.stock_id = checkout_stock_id_type_and_filter_repeat(req_content.stock_id)

        let query = 
        `
            SELECT MAIN.*

                FROM models AS MAIN

            JOIN (
                SELECT stock_id, MAX(data_date) AS data_date
                FROM models AS MAIN
                GROUP BY stock_id
            ) AS REF
            ON REF.stock_id = MAIN.stock_id
            AND REF.data_date = MAIN.data_date
            WHERE 1=1
        
        `
        if (req_content.stock_id.length > 0) {
            req_content.stock_id = req_content.stock_id.map(val => `'${val}'`)
            query += `\nAND MAIN.stock_id IN (${req_content.stock_id.join(',')})`
        }
        if (req_content.val_loss_value) {
            query += `\nAND MAIN.loss_val <= ${req_content.val_loss_value}`
        }
        if (req_content.growth_rate_value) {
            query += `\nAND MAIN.day_5_prediction / MAIN.day_0_prediction >= ${req_content.growth_rate_value}`
        }

        console.log(query)
        query += `\nORDER BY MAIN.day_5_prediction / MAIN.day_0_prediction DESC, MAIN.loss_val ASC`
        query += `\nLIMIT 10`

        const client = pgConfig()
        await client.connect()
        let pg_result = await client.query(query)
        const result = pg_result.rows

        await client.end()

        for (let idx in result) {
            
            let read_data = result[idx]
            // Transfer data to date format
            read_data['x_predict'] = read_data['x_predict'].map((val) => {return dateFns.format(new Date(val / 1000000), 'yyyy-MM-dd') })
            read_data['x_real'] = read_data['x_real'].map((val) => {return dateFns.format(new Date(val / 1000000), 'yyyy-MM-dd') })
            
            
            // data handling for website.
            read_data['datasets'] = {
                'predict': [],
                'real': []
            }
            for (let s_idx in read_data['x_predict']) {
                let dataset1 = {
                    x: read_data['x_predict'][s_idx],
                    y: read_data['y_predict'][s_idx],
                }
                let dataset2 = {
                    x: read_data['x_real'][s_idx],
                    y: read_data['y_real'][s_idx],
                }
    
                read_data['datasets']['predict'].push(dataset1)
                read_data['datasets']['real'].push(dataset2)
     
    
    
            }
    
            delete read_data['x_predict']
            delete read_data['y_predict']
            delete read_data['x_real']
            delete read_data['y_real']
    
            // result.push(read_data)
    
        }
        return result
    } catch(err) {
        console.error('err.name: ', err.name)

        return res.status(500).json({
            msg: 'SERVER GOT ERROR IN handle_stock_id_to_data!'
        })
    }

    // return ['hello this is test']
} 
const postStockMartketData = async(req, res) => {

    let req_content = req.body || req.query
    

    handle_stock_id_to_data(req_content, res)
    .then(data => {
        return res.status(200).json(data)

    })
    .catch(err => {
        console.error('err.name: ', err.name)

        return res
    })
    
}

module.exports = {
    getStockMartketData,
    postStockMartketData
}