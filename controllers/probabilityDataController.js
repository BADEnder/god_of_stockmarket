
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')
const pgConfig = require('../database/pgConfig')
const checkSQLInjection = require('../database/checkSQLInjection')

const get_probability_data = (req, res) => {
    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }

        res.status(200).json(result)
    } catch (err) {
        console.error('err.name: ', err.name)
    }
}

const post_probibility_data = async (req, res) => {
    let req_content = req.body || req.query

    let query = 
        `
            SELECT 
                MAIN.stock_id,
                MAIN.stock_name,
                MAIN.predict_data,
                MAIN.data_date

                FROM probability_data AS MAIN

            JOIN (
                SELECT stock_id, MAX(data_date) AS data_date
                FROM probability_data AS MAIN
                GROUP BY stock_id
            ) AS REF
            ON REF.stock_id = MAIN.stock_id
            AND REF.data_date = MAIN.data_date
            WHERE 1=1
        
        `

    
    if (req_content.stock_id) {
        query += 
        `
        \nAND MAIN.stock_id IN ('${req_content.stock_id}')
        `
    }



    const client = pgConfig()
    await client.connect()
    let pg_result = await client.query(query)
    const result = pg_result.rows
    await client.end()

    

    res.status(200).json(result)
}


module.exports = {
    get_probability_data,
    post_probibility_data
}