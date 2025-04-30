
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
        # from sklearn.model_selection import train_test_split

        # Self libaries
        from libs.stockmarket_data import catch_data_from_finmind, create_sequences
        # from libs.drawing import 
        # print('import module parts are ok !!!')

        def set_target_for_model ():

            argv = sys.argv
            # Setting global variable
            # # TSMC DEFAULT
            stock_id = '2330' 
            # # 漢達
            # stock_id = '6620'
            # SUNON
            # stock_id = '2421'
            if len(argv) > 1:
                stock_id = argv[1] 

            return stock_id

        stock_id = set_target_for_model()

        print(f'target stock id is. {stock_id}')
        years = 3
        time_steps = 5
        no_needed_columns = ['stock_id', 'Trading_money', 'Trading_turnover', 'date', 'open', 'max', 'min', 'spread']

        # print('this is running at here 44!!')

        end_date = date.today()
        start_date, end_date = (end_date - td(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

        # print('this is running at here 49!!')

        features, target, date_pd = catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, 'close')

        # print('this is running at here 53!!')
        
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

        X_test = X_train[-time_steps:]
        y_test = y_train[-time_steps:]


        print('data preparing SUCCESS! 73!')

    except: 
        print('data preparing FAIL!')

    # Build LSTM Model
    try:
        def build_model (lstm_nodes=256, dense_nodes=256, dropout_ratio=0.5, lr=0.001, predict_days=1):

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
            model.add(tf.keras.layers.Dense(predict_days))



            model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=lr), loss='mse', metrics=['mae'])
            return model


        model = build_model(lstm_nodes=64, dense_nodes=64, dropout_ratio=0.5, lr=0.01, predict_days=1)

        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), loss='mse', metrics=['mae'])
        print(model.summary())


        # save model
        # checkpoint_path  = 'checkpoints/cp.weights.h5'
        # checkpoint_dir  = os.path.dirname(checkpoint_path )
        # # checkpoint = os.path.join(checkpoint_path, "ckpt_{epoch}")

        # cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=checkpoint_path,
        #                                                 save_weights_only=True,
        #                                                 verbose=1)

        # Train model
        history = model.fit(
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
        print(f"Test MAE: {test_mae}\n Test loss: ${test_loss}")
        print('model trainning SUCCESS! 138 !!')

    except: 
        print('model trainning FAIL!')


    try:

        y_predict = model.predict(X_train)
        date_showed_for_real = date_pd[time_steps:].values
        date_showed_for_predict = date_pd[time_steps:].values



        new_X = X_train[-1, 1:].copy()

        date_str = end_date
        date_obj = dt.strptime(date_str, '%Y-%m-%d')
        #
        days = 30

        statiscal_data = features.values

        for i in range(days):
            if i != 0:
                new_X = new_X[-1, 1:].copy()

            date_obj = date_obj + td(days = 1)
            date_np = np.datetime64(date_obj)
            date_showed_for_predict = np.append(date_showed_for_predict, [date_np], axis=0)

            new_value = (y_predict[-1] - statiscal_data.mean()) / statiscal_data.std()

            statiscal_data = np.append(statiscal_data, [y_predict[-1]], axis=0)
            new_X = np.append(new_X, [new_value], axis=0)

            new_X = new_X.reshape(1, time_steps, -1)
            # print(new_X)
            # print(new_X.shape)
            new_predict = model.predict(new_X, verbose=0)
            y_predict = np.append(y_predict, new_predict, axis=0)

        # print(date_showed_for_real)
        # print(date_showed_for_predict)
        # print(y_predict)

        result = [
            {
                "stock_id": stock_id,
                "x_real": date_showed_for_real.reshape(-1).tolist(),
                "x_predict": date_showed_for_predict.reshape(-1).tolist(),
                "y_real": y_train.reshape(-1).tolist(),
                "y_predict": y_predict.reshape(-1).tolist()
            }
        ]
        # result_y = y_predict.reshape(-1).tolist()

        import json

        with open("./output.json", 'w', encoding="utf-8") as f:
            json.dump(result, f, indent=4)

        print('success')
    except: 
        print('some error happen!')

if __name__ == '__main__':
    print('HELLO RUNNING main.py')
    main()
