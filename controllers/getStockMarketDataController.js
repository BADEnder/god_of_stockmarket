// const pgConfig = require('../database/pgConfig')
// const checkSQLInjection = require('../database/checkSQLInjection')
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')
const {checkout_stock_id_type_and_filter_repeat} = require('./usefulFunForStock_id')
const getStockMartketData = async (req, res) => {

    try {
        let result = {
            'msg': 'DO NOT USE GET METHOD!'
        }
        res.status(200).json(result)
    } catch (err) {
        console.error(err.name)
    }

}


const handle_stock_id_to_data = async (stock_id, res) => {
    try {
        let result = []
        stock_id_sets = checkout_stock_id_type_and_filter_repeat(stock_id)

        for (let idx in stock_id_sets) {
            let filepath = path.join('data', `result_${stock_id_sets[idx]}.json`)
            if (!fs.existsSync(filepath)) {
                continue
            }
            let read_data = await fsPromise.readFile(filepath, 'utf-8', (err, data) => {})
            read_data = JSON.parse(read_data)
            read_data = {
                ...read_data[0]
            }
            
    
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
    
            result.push(read_data)
    
        }
        return result
    } catch(err) {
        console.error(err.name)
        console.error(err.msg)

        return res.status(500).json({
            msg: 'SERVER GOT ERROR IN handle_stock_id_to_data!'
        })
    }

    // return ['hello this is test']
} 
const postStockMartketData = async(req, res) => {

    let stock_id = req.query.stock_id || req.body.stock_id
    

    handle_stock_id_to_data(stock_id, res)
    .then(data => {
        return res.status(200).json(data)

    })
    .catch(err => {
        console.error(err.name)

        return res
    })
    
}

module.exports = {
    getStockMartketData,
    postStockMartketData
}