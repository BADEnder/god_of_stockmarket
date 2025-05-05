const pgConnect = require('./pgConection')


const all_query = {
    query1: 
    `
    CREATE TABLE IF NOT EXISTS models (
        stock_id bigserial PRIMARY KEY,
        stock_name character varying(50) UNIQUE,
        weights character varying (255),
        major_contents character varying(100) UNIQUE,
        
        note TEXT DEFAULT '',

        data_date timestamp DEFAULT NOW(),
        start_date timestamp DEFAULT NOW(),
        end_date timestamp DEFAULT NOW(),

        create_time timestamp DEFAULT NOW(),
        create_user character varying (100) DEFAULT 'SYSTEM',
        update_time timestamp DEFAULT NOW(),
        update_user character varying (100) DEFAULT 'SYSTEM',

        PRIMARY KEY (stock_id, data_date, start_date)
    )
    `,
    query2: 
    `
    CREATE TABLE IF NOT EXISTS infos (
        stock_id bigserial PRIMARY KEY,
        
        create_time timestamp DEFAULT NOW(),
        create_user character varying (100) DEFAULT 'SYSTEM',
        update_time timestamp DEFAULT NOW(),
        update_user character varying (100) DEFAULT 'SYSTEM',
        
        CONSTRAINT infos_with_models
        FOREIGN KEY(stock_id)
        REFERENCES models(stock_id)
    )
    `
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