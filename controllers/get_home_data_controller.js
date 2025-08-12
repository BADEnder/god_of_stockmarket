
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')
const pgConfig = require('../database/pgConfig')
const checkSQLInjection = require('../database/checkSQLInjection')

const get_home_data = (req, res) => {
    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }

        res.status(200).json(result)
    } catch (err) {
        console.error('err.name: ', err.name)
    }
}

const post_home_data = async (req, res) => {
    let req_content = req.body || req.query

    let query = 
    `
        SELECT 
            MAIN.data_date,
            MAIN.stock_id, 
            MAIN.stock_name, 
            MAIN.groth_rate_5_days, 
            MAIN.groth_rate_10_days, 
            REF.predict_data 
        
        FROM best_model_data AS MAIN

        JOIN probability_data AS REF
        ON MAIN.stock_id = REF.stock_id
        AND MAIN.data_date = REF.data_date
        WHERE 1=1
    `
    if (req_content.stock_id) {
        query += `\nAND MAIN.stock_id = '${req_content.stock_id}'`
    } 
    if (req_content.data_date) {
        query += `\nAND MAIN.data_date = '${req_content.data_date}'`
    }

    console.log(query)
    const client = pgConfig()
    await client.connect()
    let pg_result = await client.query(query)
    const result = pg_result.rows
    await client.end()

    

    res.status(200).json(result)
}


module.exports = {
    get_home_data,
    post_home_data
}