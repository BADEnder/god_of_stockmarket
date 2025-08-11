# import yfinance as yf
from FinMind.data import DataLoader

import json
import sys
import os 

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

from datetime import timedelta as td
from datetime import date

import seaborn as sns

# Self libaries
from libs.stockmarket_data import catch_data_from_finmind, create_sequences, reset_running_status
from libs.postgre_connect import run_change_query, transfer_value_to_sql

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

try:
    # 1. Download data
    years = 5
    end_date = date.today()
    start_date, end_date = (end_date - td(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

    def set_target_for_model ():

        argv = sys.argv
        # Setting global variable
        stock_name = 'TSMC'
        stock_id = '2330' 

        if len(argv) > 1:
            stock_id = argv[1]
            if len(argv) >2: 
                stock_name = argv[2]
            else: 
                stock_name = None
        return stock_id, stock_name

    stock_id, stock_name = set_target_for_model()
    print('stock_id', stock_id)
    print('stock_name', stock_name)
    # stock_id, stock_name = 3706, '神達'

    time_steps = 20

    drop_columns = [
        'Trading_money', 'open', 'max', 'min',
        'spread', 'Trading_turnover', 'Foreign_Investor_diff',
        'Investment_Trust_diff', 'Margin_Purchase_diff', 'Short_Sale_diff',
    ]
    features = catch_data_from_finmind(stock_id, start_date, end_date, drop_columns=drop_columns)

    date_time = features['date']
    features = features.drop(columns=['stock_id', 'date'], axis=1)

    scaler = StandardScaler()
    scaled = scaler.fit_transform(features)

    X, y = create_sequences(scaled, time_steps)\
    

    # Step 6: Recursive Prediction for 10 Future Days
    times = 10
    days = 10
    predictions = [[] for day in range(days)]

    best_model = None
    best_nodes = None
    best_drop_ratio = None
    best_lr = None
    lowest_val_loss = float('inf')


    print('Data preparing success!')
    for no in range(1, times+1):
        print(f"No.{no}")
        for nodes in (32,):
            for dropout_ratio in (0.2,):
                for lr in (0.001,):


                    model = tf.keras.models.Sequential([
                        tf.keras.layers.Input(shape=(time_steps, 5)),
                        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(2*nodes, return_sequences=True)),
                        tf.keras.layers.Dropout(dropout_ratio),
                        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(2*nodes, return_sequences=False)),
                        tf.keras.layers.Dropout(dropout_ratio),
                        tf.keras.layers.Dense(2*nodes, activation='relu'),
                        tf.keras.layers.Dropout(dropout_ratio),
                        tf.keras.layers.Dense(nodes, activation='relu'),

                        tf.keras.layers.Dense(5)  # Output:
                    ])
                    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=lr), loss='mse', metrics=['mae'])

                    if (no == 1):
                        print(model.summary())
                        # tf.keras.utils.plot_model(model, to_file="model.png", show_shapes=True, show_layer_names=True)

                    # Step 5: Train Model
                    model.fit(X, y, epochs=5, batch_size=32, validation_split=0.1, verbose=0)

                    
                    last_seq = X[-1]  # shape (5, 2)
                    for day in range(days):
                        pred = model.predict(last_seq[np.newaxis, ...], verbose=1)[0]
                        # print('pred: ', pred)
                        predictions[day].append(pred)
                        last_seq = np.vstack([last_seq[1:], pred])  # slide window



                    # Evaluate
                    test_loss, test_mae = model.evaluate(X, y)
                    print(f"Test loss: {test_loss}")
                    print(f"Test MAE: {test_mae}")
                    if test_loss < lowest_val_loss:
                        lowest_val_loss = test_loss
                        best_model = model
                        best_nodes, best_dropout_ratio, best_lr = nodes, dropout_ratio, lr

    print('Trainning success!')

    best_model_prediction = [[] for day in range(days)]
    last_seq = X[-1]  # shape (5, 2)
    for day in range(days):
        pred = best_model.predict(last_seq[np.newaxis, ...], verbose=0)[0]
        # print('pred: ', pred)
        best_model_prediction[day].append(pred)
        last_seq = np.vstack([last_seq[1:], pred])  # slide window

    best_model_prediction = np.array(best_model_prediction)
    best_model_prediction = best_model_prediction.reshape(-1, best_model_prediction.shape[2])
    best_model_prediction = scaler.inverse_transform(best_model_prediction)

    best_model_prediction_volume = best_model_prediction[:, 0]
    best_model_prediction_close = best_model_prediction[:, 1]


    predictions_backup = predictions

    probablity_prediction = []
    for day in range(days):
        predictions = np.array(predictions_backup[day].copy())


        predicted_real_data = scaler.inverse_transform(predictions)

        volume_vals = predicted_real_data[:, 0]
        close_vals = predicted_real_data[:, 1]

        volume_bins = np.histogram_bin_edges(volume_vals, bins='auto')
        close_bins = np.histogram_bin_edges(close_vals, bins='auto')

        volume_hist, _ = np.histogram(volume_vals, bins=volume_bins)
        close_hist, _ = np.histogram(close_vals, bins=close_bins)

        obj = {
            "edges": close_bins.tolist(),
            "probability": close_hist.tolist(),
        }

        probablity_prediction.append(obj)

    print('Predict success!')

        


    best_model_prediction_data = [
        {
            "stock_id": stock_id,
            "stock_name": stock_name,
            
            "loss_val": lowest_val_loss,
            "dropout_ratio": best_dropout_ratio,
            "learning_rate": best_lr,
            "neural_nodes": best_nodes,
            
            "groth_rate_5_days": best_model_prediction_close[5-1] / features['close'].values.tolist()[-1],
            "groth_rate_10_days": best_model_prediction_close[10-1] / features['close'].values.tolist()[-1],
            "data_date": end_date,
            "start_date": start_date,
            "end_date": end_date,

            "predict_data": best_model_prediction_close.tolist(),
            "real_data": features['close'].values.tolist(),
            "date_time": json.dumps([elem.strftime('%Y-%m-%d') for elem in date_time.tolist()])
        }
    ]

    probablity_prediction_data = [
        {
            "stock_id": stock_id,
            "stock_name": stock_name,

            "predict_data": json.dumps(probablity_prediction),
            
            "data_date": end_date,

        }
    ]

    transfer_value_to_sql(best_model_prediction_data)
    transfer_value_to_sql(probablity_prediction_data)

    table_name = 'best_model_data'
    query1 = f"INSERT INTO public.{table_name} ({', '.join(best_model_prediction_data[0].keys())}) VALUES({', '.join(best_model_prediction_data[0].values())})"

    table_name = 'probability_data'
    query2 = f"INSERT INTO public.{table_name} ({', '.join(probablity_prediction_data[0].keys())}) VALUES({', '.join(probablity_prediction_data[0].values())})"

    # print(query1)
    run_change_query(query1)
    run_change_query(query2)

except:
    print('Some error happened!')

finally:
    reset_running_status()