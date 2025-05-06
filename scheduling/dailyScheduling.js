const fs = require('fs')
const fsPromise = fs.promises
const path = require('path')

const dateFns = require('date-fns')
const cron = require('node-cron')
const axios = require('axios')

const local_host = 'http://localhost'

let stock_id
let stock_name
const run_major_job = async () => {
    const today = dateFns.format(new Date(), 'yyyyMMdd')
    const topTradingVolumeDataPath = path.join(__dirname, '..', 'data', `real_data_${today}`, 'master.json')
    let topTradingVolumeData = await fsPromise.readFile(topTradingVolumeDataPath)
    topTradingVolumeData = JSON.parse(topTradingVolumeData)

    console.log(topTradingVolumeData.length)

    // const allData = require(`../data/real_data_${today}/all_data.json`)

    try {
    
        const checkJob = setInterval(async () => {
            const runningStatusPath = path.join(__dirname, '..', 'config', 'runningStatus.json')

            let runningStatusNow = await fsPromise.readFile(runningStatusPath)
            console.log('here you not go, status: 1.')

            if (runningStatusNow == 0) {

                console.log('here you go, status: 0.')
                let row = topTradingVolumeData.shift()
                stock_id = row['Code']
                stock_name = row['Name']
        
                console.log('stock_id', stock_id)
                console.log('stock_name', stock_name)
                console.log('topTradingVolumeData.length', topTradingVolumeData.length)
        
                let body = {
                    stock_id: stock_id,
                    stock_name: stock_name,
                    username: 'Ender',
                    password: '789'
                }
            
                console.log(body)
                
                let url = `${local_host}/api/pythonExecAPI`
                let response = await axios.post(
                    url,
                    body,
                    {
                        'headers': {
                            'Content-Type': 'application/json',
                        }
                    },
        
                )
        
                // console.log('here you go!!')
                // console.log(runningStatusPath)
                await fsPromise.writeFile(runningStatusPath, '1', 'utf-8')
            
                console.log(response.data)
            }

            if (topTradingVolumeData.length == 0) {
                clearInterval(checkJob)
            }

        }, 10*1000)

        
    } catch (err) {
        if (err.name == 'AxiosError') {
            console.error(err.response.status)
            console.error(err.response.data)
        } else {
            console.error(err.name)
        }
    }

}


const main = async () => {
    const url = `${local_host}/api/getDataFromOpenSite`
    let response = await axios.post(url)
    
    console.log('dailyScheduling is running')
    run_major_job()
}

main()

// cron.schedule('0 * 01 * * *', async () => {
//     console.log(topTradingVolumeData.length)
//     console.log(allData.length)

//     const url = 'http://127.0.0.1/api/getDataFromOpenSite'
//     let response = await axios.post(url)

//     run_major_job()

// })