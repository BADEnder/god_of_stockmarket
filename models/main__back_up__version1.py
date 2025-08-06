

def reset_running_status():
    with open(f"./config/runningStatus.txt", 'w', encoding='utf-8') as status_file:
        status_file.write('0')
        print('reset status Success!')


def main():
    # Preparing data and Initialize the packages.
    try:
        import sys
        import os 

        os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

        import numpy as np
        import pandas as pd
        from datetime import datetime as dt, timedelta as td, date

        import tensorflow as tf
        # from sklearn.preprocessing import MinMaxScaler

        # Self libaries
        from libs.stockmarket_data import catch_data_from_finmind, create_sequences
        from libs.postgre_connect import run_change_query, transfer_value_to_sql

        # from libs.drawing import 
        print('Import module parts are ok !!!')

        def set_target_for_model ():

            argv = sys.argv
            # Setting global variable
            stock_name = 'TSMC'
            stock_id = '2330' 
            # # 漢達
            # stock_id = '6620'
            # SUNON
            # stock_id = '2421'
            if len(argv) > 1:
                stock_id = argv[1]
                if len(argv) >2: 
                    stock_name = argv[2]
                else: 
                    stock_name = None
            return stock_id, stock_name

        stock_id, stock_name = set_target_for_model()

        print(f'target stock id and stock_name is. {stock_id}, {stock_name}')
        years = 0.1
        time_steps = 5
        no_needed_columns = ['stock_id', 'Trading_money', 'Trading_turnover', 'date', 'open', 'max', 'min', 'spread']
        end_date = date.today()
        start_date, end_date = (end_date - td(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
        features, target, date_pd = catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, 'close')

        
        # Normalize data
        # scaler = MinMaxScaler()
        # features_scaled = scaler.fit_transform(features)
        # features_scaled = features

        features_stded = (features - features.mean()) / features.std()
        features_scaled = features_stded

        time_steps = 5  # Use 5 days of past data to predict next day
        X, y = create_sequences(features_scaled, target, time_steps= time_steps)

        X_train, X_val = X, X[len(X)*4//5:]
        y_train, y_val = y, y[len(y)*4//5:]

        X_test = X_train[-4*time_steps:]
        y_test = y_train[-4*time_steps:]
        # X_test = X_train
        # y_test = y_train


        print('Data preparing SUCCESS! 73!')

    except: 
        reset_running_status()
        print('Data preparing FAIL!')

    # Build LSTM Model
    try:
        def build_model (lstm_nodes=256, dense_nodes=256, dropout_ratio=0.5, lr=0.001):

            model = tf.keras.Sequential()

            # 1.Add LSTM layers
            # model.add(tf.keras.layers.GRU(64, return_sequences=True, input_shape=(time_steps, X.shape[2])))
            # model.add(tf.keras.layers.GRU(32, return_sequences=False))
            model.add(tf.keras.layers.LSTM(lstm_nodes, return_sequences=True, input_shape=(time_steps, X.shape[2])))
            model.add( tf.keras.layers.LSTM(lstm_nodes, return_sequences=False))

            # 2. Add dense layers
            model.add(tf.keras.layers.Dense(dense_nodes, activation='relu'))
            model.add(tf.keras.layers.Dense(dense_nodes*2, activation='relu'))

            model.add(tf.keras.layers.Dropout(dropout_ratio))



            # 3. Final layer
            model.add(tf.keras.layers.Dense(dense_nodes, activation='relu'))
            model.add(tf.keras.layers.Dense(1))



            # model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=lr), loss='mse', metrics=['mae'])
            return model

        lowest_val_loss = float('inf')
        best_model = None
        best_nodes = None
        best_dropout_ratio = None
        best_lr = None
        # for nodes in (64, 128):
        #     for dropout_ratio in (0.2, 0.5):
        #         for lr in (0.001, 0.01):
        for nodes in (64,):
            for dropout_ratio in (0.5,):
                for lr in (0.001,):
                    
                    print(nodes, dropout_ratio, lr)
                    # model = build_model(lstm_nodes=nodes, dense_nodes=nodes, dropout_ratio=0.001, lr=0.1, predict_days=1)
                    model = build_model(lstm_nodes=nodes, dense_nodes=nodes, dropout_ratio=dropout_ratio, lr=lr)

                    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=lr), loss='mse', metrics=['mae'])
                    print(model.summary())


                    # Save model
                    # checkpoint_path  = 'checkpoints/cp.weights.h5'
                    # checkpoint_dir  = os.path.dirname(checkpoint_path )
                    # # checkpoint = os.path.join(checkpoint_path, "ckpt_{epoch}")

                    # cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,
                    #                                                 save_weights_only=True,
                    #                                                 verbose=1)

                    # Train model
                    model.fit(
                        X_train, y_train, 
                        validation_data=(X_val, y_val), 
                        epochs=20, 
                        batch_size=8,
                        verbose = 0
                        # callbacks = [cp_callback]
                    )

                    # model.save(f'models/stock_id={stock_id}__{end_date}__years={years}__time_step={time_steps}__model.keras')
                    
                    
                    # Evaluate
                    test_loss, test_mae = model.evaluate(X_test, y_test)
                    print(f"Test loss: {test_loss}")
                    print(f"Test MAE: {test_mae}")
                    if test_loss < lowest_val_loss:
                        lowest_val_loss = test_loss
                        best_model = model
                        best_nodes, best_dropout_ratio, best_lr = nodes, dropout_ratio, lr



        print('Model trainning SUCCESS! 156 !!')

    except: 
        reset_running_status()
        print('Model trainning FAIL!')


    try:

        y_predict = best_model.predict(X_train)
        date_showed_for_real = date_pd[time_steps:].values
        date_showed_for_predict = date_pd[time_steps:].values



        new_X = X_train[-1, 1:].copy()

        date_str = end_date
        date_obj = dt.strptime(date_str, '%Y-%m-%d')
        #
        days = 30
        day_0_prediction = y_train.reshape(-1).tolist()[-1]
        day_5_prediction = 0
        day_10_prediction = 0
        day_15_prediction = 0
        day_20_prediction = 0
        day_25_prediction = 0
        day_30_prediction = 0

        statiscal_data = features.values

        for idx in range(1, days+30):
            if idx != 1:
                new_X = new_X[-1, 1:].copy()


            date_obj = date_obj + td(days = 1)
            date_np = np.datetime64(date_obj)
            date_showed_for_predict = np.append(date_showed_for_predict, [date_np], axis=0)

            new_value = (y_predict[-1] - statiscal_data.mean()) / statiscal_data.std()

            statiscal_data = np.append(statiscal_data, [y_predict[-1]], axis=0)
            new_X = np.append(new_X, [new_value], axis=0)

            new_X = new_X.reshape(1, time_steps, -1)
            new_predict = best_model.predict(new_X, verbose=0)

            if idx % 5 == 0:

                if idx == 5:
                    day_5_prediction = new_predict.reshape(-1).tolist()[0]
                if idx == 10:
                    day_10_prediction = new_predict.reshape(-1).tolist()[0]
                if idx == 15:
                    day_15_prediction = new_predict.reshape(-1).tolist()[0]
                if idx == 20:
                    day_20_prediction = new_predict.reshape(-1).tolist()[0]
                if idx == 25:
                    day_25_prediction = new_predict.reshape(-1).tolist()[0]
                if idx == 30:
                    day_30_prediction = new_predict.reshape(-1).tolist()[0]
            y_predict = np.append(y_predict, new_predict, axis=0)

        result = [
            {
                "stock_id": stock_id,
                "stock_name": stock_name,
                "loss_val": lowest_val_loss,
                "dropout_ratio": best_dropout_ratio,
                "learning_rate": best_lr,
                "neural_nodes": best_nodes,
                "day_0_prediction": day_0_prediction,
                "day_5_prediction": day_5_prediction,
                "day_10_prediction": day_10_prediction,
                "day_15_prediction": day_15_prediction,
                "day_20_prediction": day_20_prediction,
                "day_25_prediction": day_25_prediction,
                "day_30_prediction": day_30_prediction,
                
                "data_date": end_date,
                "start_date": start_date,
                "end_date": end_date,

                "x_real": date_showed_for_real.reshape(-1).tolist(),
                "x_predict": date_showed_for_predict.reshape(-1).tolist(),
                "y_real": y_train.reshape(-1).tolist(),
                "y_predict": y_predict.reshape(-1).tolist()
            }
        ]
        # print(result)
        # result_y = y_predict.reshape(-1).tolist()

        # import json

        # with open(f"./data/result_{stock_id}.json", 'w', encoding="utf-8") as f:
        #     json.dump(result, f, indent=4)

        
        def insert_query_format(data):
            table_name = 'models'
            query = f"INSERT INTO public.{table_name} ({', '.join(data[0].keys())}) VALUES({', '.join(data[0].values())})"

            run_change_query(query)

        print('Prediction success!')
        transfer_value_to_sql(result)
        

        insert_query_format(result)

        reset_running_status()
    except: 
        reset_running_status()
        print('Some error happened!')

if __name__ == '__main__':
    print('---------\tACTIVATING main.py\t---------')
    main()
    print('---------\tDEACTIVATING main.py\t---------')