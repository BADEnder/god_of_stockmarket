const pgConnect = require('./pgConection')


const all_query = {
    query1: 
    `
    DROP TABLE IF EXISTS probability_data
    `,
    query2: 
    `
    DROP TABLE IF EXISTS best_model_data
    `,

    
}

const main = async () => {

try {
    for (let key in all_query) {
        let item = all_query[key]
        await pgConnect(item)
    }
} catch (err) {
    console.log(err)
}

}


module.exports = main