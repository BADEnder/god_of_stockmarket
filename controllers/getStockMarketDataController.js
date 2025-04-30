// const pgConfig = require('../database/pgConfig')
// const checkSQLInjection = require('../database/checkSQLInjection')
const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises
const dateFns = require('date-fns')

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


const checkout_stock_id_type_and_filter_repeat = (stock_id_sets) => {
    if (typeof(stock_id_sets) == 'string' ||
        typeof(stock_id_sets) == 'number' 
        ) {
        stock_id_sets = [String(stock_id_sets)]
    } else if (!Array.isArray(stock_id_sets)) {
        return null
    }

    let non_repeat_stock_sets = []
    let check_repaet_data_set = new Set()
    
    for (stock_id of stock_id_sets) {
        if (!check_repaet_data_set.has(stock_id)) {
            non_repeat_stock_sets.push(stock_id)
            check_repaet_data_set.add(stock_id)
        }
    }
    
    return non_repeat_stock_sets
}
const handle_stock_id_to_data = async (stock_id, res) => {
    try {
        let result = []
        stock_id_sets = checkout_stock_id_type_and_filter_repeat(stock_id)
        
        for (let idx in stock_id_sets) {
            let read_data = await fsPromise.readFile(path.join('data', `result_${stock_id_sets[idx]}.json`), 'utf-8', (err, data) => {
            })
            read_data = JSON.parse(read_data)
            read_data = {
                ...read_data[0]
            }
            // console.log('read_data:', read_data)
            // console.log('Object.keys(read_data):', Object.keys(read_data))
            
    
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

        res.status(500).json({
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