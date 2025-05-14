const pgConnect = require('./pgConection')


const all_query = {
    // query1: 
    // `
    // CREATE TABLE IF NOT EXISTS models (
    //     stock_id bigserial,
    //     stock_name character varying(50) UNIQUE,
    //     weights character varying (255),
    //     major_contents character varying(100) UNIQUE,
        
    //     note TEXT DEFAULT '',

    //     data_date timestamp DEFAULT NOW(),
    //     start_date timestamp DEFAULT NOW(),
    //     end_date timestamp DEFAULT NOW(),

    //     create_time timestamp DEFAULT NOW(),
    //     create_user character varying (100) DEFAULT 'SYSTEM',
    //     update_time timestamp DEFAULT NOW(),
    //     update_user character varying (100) DEFAULT 'SYSTEM',

    //     PRIMARY KEY (stock_id, data_date, start_date)
    // )
    // `,
    query1: 
    `
    CREATE TABLE IF NOT EXISTS models (
        stock_id character varying(20),
        stock_name character varying(50),
        neural_nodes bigint,
        loss_val numeric,
        
        day_0_prediction decimal(20, 6),
        day_5_prediction decimal(20, 6),
        day_10_prediction decimal(20, 6),
        day_15_prediction decimal(20, 6),
        day_20_prediction decimal(20, 6),
        day_25_prediction decimal(20, 6),
        day_30_prediction decimal(20, 6),
        
        note TEXT DEFAULT '',

        data_date timestamp DEFAULT NOW(),
        start_date timestamp DEFAULT NOW(),
        end_date timestamp DEFAULT NOW(),

        create_time timestamp DEFAULT NOW(),
        create_user character varying (100) DEFAULT 'SYSTEM',
        update_time timestamp DEFAULT NOW(),
        update_user character varying (100) DEFAULT 'SYSTEM',

        x_real json,
        x_predict json,
        y_real json,
        y_predict json,

        PRIMARY KEY (stock_id, data_date)
    )
    `,
    // query2: 
    // `
    // CREATE TABLE IF NOT EXISTS infos (
    //     stock_id bigserial,
        
    //     create_time timestamp DEFAULT NOW(),
    //     create_user character varying (100) DEFAULT 'SYSTEM',
    //     update_time timestamp DEFAULT NOW(),
    //     update_user character varying (100) DEFAULT 'SYSTEM',
        
    //     PRIMARY KEY (stock_id),
    //     CONSTRAINT infos_with_models
    //     FOREIGN KEY(stock_id)
    //     REFERENCES models(stock_id)
    // )
    // `
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