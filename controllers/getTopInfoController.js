const dateFns = require('date-fns')
const today = dateFns.format(new Date(), 'yyyyMMdd')
const getTopInfo = (req, res) => {

    try {
        let data = require(`../data/real_data_${today}/all_data.json`)
        let result = []
    
        let query = req.query || req.body
        
        // console.log('data.length: \n', data.length)
        // console.log('data[0]: \n', data[0])
        result = [...data]
        
        console.log(query)
        result = result.filter(val => {return val['ClosingPrice']})
    
        if (query.enoughMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 6})
        } 
    
        if (query.enoughTenMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 7})
        } 
    
        if (query.enoughHundredMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 8})
        } 
    
    
        result.sort((a, b) => {
            return a['ClosingPrice'] - b['ClosingPrice']
        })
    
        result = result.slice(0, 10)
    
        console.log('result.length: \n', result.length)
        console.log('result[0]: \n', result[0])
    
        return res.status(200).json(result)
    } catch (error) {
        console.error(error.name)
        res.status(500).json({msg: 'Internal Server Error'})
    }


}

// const postTopInfo = () => {

// }


module.exports = {
    getTopInfo,
    // postTopInfo
}