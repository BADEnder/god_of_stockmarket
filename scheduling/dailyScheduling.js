let majorRunningIndex = false

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
    let startTime = new Date()
    let today = dateFns.format(startTime, 'yyyyMMdd')
    let topTradingVolumeDataPath = path.join(__dirname, '..', 'data', `real_data_${today}`, 'master.json')

    let targetStockIdArray = await fsPromise.readFile(topTradingVolumeDataPath)
    targetStockIdArray = JSON.parse(targetStockIdArray)

    console.log(`---------Total Target Length: ${targetStockIdArray.length}---------`)

    try {
    
        let checkJob = setInterval(async () => {
            let runningStatusPath = path.join(__dirname, '..', 'config', 'runningStatus.txt')

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
                
                // let targetPath = path.join(__dirname, '..', 'models/main.py')
                let targetPath = path.join(__dirname, '..', 'models/__stockmarket_god.py')
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
                let endTime = new Date()
                console.log('---------------------------------------------')
                console.log(`Start Time: ${dateFns.format(startTime, 'yyyy-MM-dd HH:mm:ss')}`)
                console.log(`End Time: ${dateFns.format(endTime, 'yyyy-MM-dd HH:mm:ss')}`)
                console.log(`Total Running Time: ${(endTime - startTime) / (1000 * 60)} (mins)`)
                console.log('---------------------------------------------')
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
cron.schedule('0 1 8 * * *', async () => {
    if (!majorRunningIndex) {
        majorRunningIndex = true
        mainFunction()
    }
})