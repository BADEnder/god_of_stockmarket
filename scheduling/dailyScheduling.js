const topTradingVolumeData = require('../data/result_20250430/master.json')
const allData = require('../data/result_20250430/all_data.json')

const cron = require('node-cron')


const axios = require('axios')

const run_major_job = async () => {
    try {
    
        let row = topTradingVolumeData[2]
        stock_id = row['Code']
        stock_name = row['Name']


    
        for (let idx in topTradingVolumeData) {
            let row = topTradingVolumeData[idx]
        }
    
        let body = {
            stock_id: topTradingVolumeData[2]['Code'],
            stock_name: topTradingVolumeData[2]['Name'],
            username: 'Ender',
            password: '789'
        }
    
        console.log(body)
        
        let url = 'http://127.0.0.1/api/pythonExecAPI'
        let response = await axios.post(
            url,
            body,
            // {
            //     'headers': {
            //         'Content-Type': 'application/json',
            //     },
            //     'timeout': 100000
    
            // }    
        )
    
        console.log(response.data)
        
    } catch (err) {
        if (err.name == 'AxiosError') {
            console.error(err.response.status)
            console.error(err.response.data)
        } else {
            console.error(err.name)
        }
    }

}

run_major_job()

// cron.schedule('0 * * * * *', () => {
//     console.log(topTradingVolumeData.length)
//     console.log(allData.length)
// })