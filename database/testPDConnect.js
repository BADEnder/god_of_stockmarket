const pgConection = require('./pgConection')


function main () {
    console.log('Running!')
    const query = 
    `
    SHOW TABLES;
    `
    
    console.log(pgConection(query))
}


module.exports = main