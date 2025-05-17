const majorRunningIndex = false

const fs = require('fs')
const fsPromise = fs.promises
const path = require('path')

const dateFns = require('date-fns')
const cron = require('node-cron')
const axios = require('axios')

const {exec, ChildProcess} = require('child_process')

const local_host = 'http://localhost'

let stock_id
let stock_name
const runMajorSchedulingJob = async () => {
    const today = dateFns.format(new Date(), 'yyyyMMdd')
    const topTradingVolumeDataPath = path.join(__dirname, '..', 'data', `real_data_${today}`, 'all_data.json')
    let targetStockIdArray = await fsPromise.readFile(topTradingVolumeDataPath)
    targetStockIdArray = JSON.parse(targetStockIdArray)

    console.log(`---------Total Target Length: ${targetStockIdArray.length}---------`)

    try {
    
        const checkJob = setInterval(async () => {
            const runningStatusPath = path.join(__dirname, '..', 'config', 'runningStatus.txt')

            let runningStatusNow = await fsPromise.readFile(runningStatusPath, 'utf-8')
            console.log('STATUS: 1, RUNNING!')
            
            // console.log(runningStatusNow.trim())
            if (runningStatusNow.trim() != 1) {

                let row = targetStockIdArray.shift()
                stock_id = row['Code']
                stock_name = row['Name']

                console.log('STATUS: 0, NOT RUNNING!')
                console.log('---------------')
                console.log('Rest Target Length', targetStockIdArray.length)
                console.log('stock_id', stock_id)
                console.log('stock_name', stock_name)
                console.log('---------------')
                
                const targetPath = path.join(__dirname, '..', 'models/main.py')
                let command = `python ${targetPath} ${stock_id} ${stock_name}`

                console.log(command)
                if (stock_id != 'UNKNOWN') {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Execution Got Error:\n ${error}`)
                            return
                          }
                          console.log(`Execution Stdout:\n ${stdout}`)
                    })
                    

                } 
        
                await fsPromise.writeFile(runningStatusPath, '1', 'utf-8')
        
            }

            if (targetStockIdArray.length == 0) {
                clearInterval(checkJob)
                majorRunningIndex = false
            }

        }, 10*1000)

        
    } catch (err) {

            console.error('err.name: ', err.name)
    }

}


const mainFunction = async () => {
    const url = `${local_host}/api/getDataFromOpenSite`
    await axios.post(url)
    
    console.log('dailyScheduling is running')
    runMajorSchedulingJob()
}



mainFunction()
cron.schedule('0 1 0,6,12,18 * * *', async () => {
    if (!majorRunningIndex) {
        majorRunningIndex = true
        mainFunction()
    }
})