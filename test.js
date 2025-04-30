// const fs = require('fs')
// // const path = require('path')
// // const data = fs.readFileSync('./test.json', 'utf-8')
// // const math = require('math')
// const data = require('./test.json')
// // console.log(typeof(data))
// // console.log(data[0])
// // console.log(data)
// let result = []
// for (let idx in data) {
//     const obj = data[idx]
//     if (
//         Math.abs(obj['Change'] / obj['ClosingPrice']) > 0.07 &&  
//         obj['ClosingPrice'] <= 50 &&
//          obj['TradeVolume'] >= 1000000) {
//         result.push(obj)
//     } 
// }

// console.log(result.length)

// fs.writeFileSync('./result.json', JSON.stringify(result))







// const obj = {
//     "age": 15,
//     "name": 'yanping'
// }

// obj.forEach((val, key) => {
//     console.log(val)
//     console.log(key)
// });

// for (let key in obj) {
    // console.log(a)
// } 


// let stock_id = {'name': '2120'}
// let stock_id_sets = ['2120', '1120', '1120']
// let result = []
// let check_repaet_data_set = new Set()

// for (stock_id of stock_id_sets) {
//     if (!check_repaet_data_set.has(stock_id)) {
//         result.push(stock_id)
//         check_repaet_data_set.add(stock_id)
//     }
// }


// stock_id = 123
// console.log(String(stock_id))

// console.log((result))


// console.log(Array.isArray(stock_id))
// console.warn(typeof(stock_id))
// console.log(typeof(typeof(stock_id)))



console.log(2**4)
console.log(2^4)