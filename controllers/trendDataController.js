const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')
const pgConfig = require('../database/pgConfig')
const checkSQLInjection = require('../database/checkSQLInjection')

const getStockMartketData = async (req, res) => {

    try {
        console.log(123)

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
            SELECT 
                MAIN.stock_id, 
                MAIN.stock_name, 
                MAIN.loss_val, 
                MAIN.neural_nodes, 
                MAIN.learning_rate, 
                MAIN.dropout_ratio, 
                MAIN.groth_rate_5_days, 
                MAIN.groth_rate_10_days, 
                MAIN.data_date, 
                MAIN.start_date, 
                MAIN.end_date, 

                MAIN.predict_data, 
                MAIN.real_data, 
                MAIN.date_time

                FROM best_model_data AS MAIN

            JOIN (
                SELECT stock_id, MAX(data_date) AS data_date
                FROM best_model_data AS MAIN
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
            query += `\nAND MAIN.groth_rate_5_days >= ${req_content.growth_rate_value}`
        }

        query += `\nORDER BY MAIN.groth_rate_5_days DESC, MAIN.loss_val ASC`
        query += `\nLIMIT 10`

        const client = pgConfig()
        await client.connect()
        let pg_result = await client.query(query)
        const result = pg_result.rows
        await client.end()

        // data handle for frontend
        for (let obj of result) {
            const last_day = new Date(obj['date_time'].slice(-1))
            let predict_date_time = []
            for (let plus_days=1; plus_days<=obj['predict_data'].length; plus_days++) {
                
                let day = new Date(last_day)
                day = dateFns.format(day.setDate(last_day.getDate() + plus_days), 'yyyy-MM-dd')
                predict_date_time.push(day)
            }
                        

            obj['predict_data'] = obj['predict_data'].map((val, idx) => {
                return {
                    "x": predict_date_time[idx],
                    "y": val
                }
            })
            
            obj['real_data'] = obj['real_data'].slice(-60)
            obj['date_time'] = obj['date_time'].slice(-60)

            obj['real_data'] = obj['real_data'].map((val, idx) => {
                return {
                    "x": obj['date_time'][idx],
                    "y": val
                }
            })

            delete obj['date_time']
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
        // console.log(data)
        return res.status(200).json(data)
    })
    .catch(err => {
        return res
    })
    
}

module.exports = {
    getStockMartketData,
    postStockMartketData
}