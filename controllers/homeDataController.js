
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
            MAIN.groth_rate_10_days
        
        FROM (
            SELECT 
                MAJOR_DATA.data_date,
                MAJOR_DATA.stock_id, 
                MAJOR_DATA.stock_name, 
                MAJOR_DATA.groth_rate_5_days, 
                MAJOR_DATA.groth_rate_10_days
            FROM best_model_data AS MAJOR_DATA
            
            INNER JOIN (
                SELECT stock_id, MAX(data_date) AS data_date
                FROM best_model_data
                GROUP BY stock_id
            ) AS MAX_DATA_DATE_TAB
            ON MAX_DATA_DATE_TAB.stock_id = MAJOR_DATA.stock_id
            AND MAX_DATA_DATE_TAB.data_date = MAJOR_DATA.data_date
        ) AS MAIN

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

    query += 
    `
    ORDER BY MAIN.data_date DESC, MAIN.groth_rate_5_days DESC
    `

    const client = pgConfig()
    await client.connect()
    let pg_result = await client.query(query)
    let result = pg_result.rows
    await client.end()

    result = result.map(val => {
        val['data_date'] = dateFns.format(new Date(val['data_date']), 'yyyy-MM-dd')
        return val
    })
    

    res.status(200).json(result)
}


module.exports = {
    get_home_data,
    post_home_data
}

