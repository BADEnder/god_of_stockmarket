const drop_table = require('./dropTables')
const create_table = require('./createTables')


const main = async () => {
    await drop_table()
    await create_table()
}

main()