const {logEvent} = require('./logMiddleware')
const {format} = require('date-fns')

const errorHandler = (err, req, res, next) => {
    const today = format(new Date(), 'yyyy-MM-dd')

    logEvent(`${err.name}: ${err.message}`, `errorLog_${today}.txt`)

    res.status(500).send(err.message)
}

module.exports = errorHandler