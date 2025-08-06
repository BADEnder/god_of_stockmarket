const pgConnect = require('./pgConection')


const all_query = {

    // query1: 
    // `
    // CREATE TABLE IF NOT EXISTS models (
    //     stock_id character varying(20),
    //     stock_name character varying(50),
    //     loss_val decimal(20, 6),
    //     neural_nodes bigint,
    //     learning_rate decimal(20, 6),
    //     dropout_ratio decimal(20, 6),
        
    //     day_0_prediction decimal(20, 6),
    //     day_5_prediction decimal(20, 6),
    //     day_10_prediction decimal(20, 6),
    //     day_15_prediction decimal(20, 6),
    //     day_20_prediction decimal(20, 6),
    //     day_25_prediction decimal(20, 6),
    //     day_30_prediction decimal(20, 6),
        
    //     note TEXT DEFAULT '',

    //     data_date timestamp DEFAULT NOW(),
    //     start_date timestamp DEFAULT NOW(),
    //     end_date timestamp DEFAULT NOW(),

    //     create_time timestamp DEFAULT NOW(),
    //     create_user character varying (100) DEFAULT 'SYSTEM',
    //     update_time timestamp DEFAULT NOW(),
    //     update_user character varying (100) DEFAULT 'SYSTEM',

    //     x_real json,
    //     x_predict json,
    //     y_real json,
    //     y_predict json,

    //     PRIMARY KEY (stock_id, data_date)
    // )
    // `,
    query1: 
    `
    CREATE TABLE IF NOT EXISTS best_model_data (
        stock_id character varying(20),
        stock_name character varying(50),
        loss_val decimal(20, 6),
        neural_nodes bigint,
        learning_rate decimal(20, 6),
        dropout_ratio decimal(20, 6),
        groth_rate_5_days decimal(20, 6),
        groth_rate_10_days decimal(20, 6),

        data_date date DEFAULT NOW(),
        start_date timestamp DEFAULT NOW(),
        end_date timestamp DEFAULT NOW(),

        create_time timestamp DEFAULT NOW(),
        create_user character varying (100) DEFAULT 'SYSTEM',
        update_time timestamp DEFAULT NOW(),
        update_user character varying (100) DEFAULT 'SYSTEM',

        predict_data json,
        real_data json,
        date_time json,
        
        note TEXT DEFAULT '',

        PRIMARY KEY (stock_id, data_date)
    )
    `,
    query2: 
    `
    CREATE TABLE IF NOT EXISTS probability_data (
        stock_id character varying(20),
        stock_name character varying(50),
        
        
        data_date date DEFAULT NOW(),

        create_time timestamp DEFAULT NOW(),
        create_user character varying (100) DEFAULT 'SYSTEM',
        update_time timestamp DEFAULT NOW(),
        update_user character varying (100) DEFAULT 'SYSTEM',

        note TEXT DEFAULT '',

        
        predict_data json,



        PRIMARY KEY (stock_id, data_date),
        CONSTRAINT FK_BEST_MODEL_DATA FOREIGN KEY(stock_id, data_date) REFERENCES best_model_data(stock_id, data_date)
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