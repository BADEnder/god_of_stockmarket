const { format } = require('date-fns')
const { v4: uuid} = require('uuid')

const path = require('path')
const fs = require('fs')
const fsPromise = fs.promises

const logEvent = async (msg, fileName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n` 

    try {
        if( !fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromise.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromise.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logRecord = (req, res, next) => {
    const msg = `${req.method}\t${req.headers.origin}\t${req.url}`
    const today = format(new Date(), 'yyyy-MM-dd')

    logEvent(msg, `reqLog_${today}.txt`)
    next()
}



module.exports = {
    logEvent,
    logRecord
}