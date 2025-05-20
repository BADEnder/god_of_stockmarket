const dateFns = require('date-fns')
const today = dateFns.format(new Date(), 'yyyyMMdd')
const getTopInfo = (req, res) => {

    try {
        let data = require(`../data/real_data_${today}/all_data.json`)
        let result = []
    
        let query = req.query || req.body
        
        result = [...data]
        
        result = result.filter(val => {return val['ClosingPrice'] && val['ClosingPrice'] <= 100})
    
        if (query.enoughMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 6})
        } 
    
        if (query.enoughTenMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 7})
        } 
    
        if (query.enoughHundredMillionTradeVolume) {
            result = result.filter(val => {return val['TradeVolume'] >= 10 ** 8})
        } 
    
    
        // result.sort((a, b) => {
        //     return a['ClosingPrice'] - b['ClosingPrice']
        // })
    
        result.sort((a, b) => {
            return b['TradeVolume'] - a['TradeVolume']
        })
    
        result = result.slice(0, 10)
    
    
        return res.status(200).json(result)
    } catch (err) {
        console.log('-----getTopInfoController.getTopInfo got error!! -----')
        console.error('err.name:', err.name)
        res.status(500).json({msg: 'Internal Server Error'})
    }


}

// const postTopInfo = () => {

// }


module.exports = {
    getTopInfo,
    // postTopInfo
}