import os 

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import pandas as pd
import datetime as dt
import tensorflow as tf


from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Self libaries
from libs.stockmarket_data import *
from libs.drawing import * 


# Setting global variable
stock_id = '2330'
years = 3
time_steps = 5
no_needed_columns = ['stock_id', 'Trading_money', 'Trading_turnover', 'date', 'open', 'max', 'min', 'spread']



end_date = dt.date.today()
start_date, end_date = (end_date - dt.timedelta(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

features, target = catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, 'close')

# Normalize data
scaler = MinMaxScaler()
features = scaler.fit_transform(features)

X, y = create_sequences(features, target, time_steps=time_steps)

X_train, X_val = X, X[len(X)*4//5:]
y_train, y_val = y, y[len(y)*4//5:]

X_test = X_train[-time_steps:]
y_test = y_train[-time_steps:]




# if __name__  == "__main__":

# Build LSTM Model
model = tf.keras.models.load_model('models/my_model.keras')

model2 = tf.keras.Sequential()
model2.add(model)
model2.add(tf.keras.layers.Dense(3, activation='relu'))

model2.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), loss='mse', metrics=['mae'])


print(model.summary())
test_loss, test_mae = model.evaluate(X_test, y_test)
print(f"Test MAE: {test_mae}\n Test loss: ${test_loss}")


print('model2: \n', model2.summary())
test_loss2, test_mae2 = model2.evaluate(X_test, y_test)
print(f"Test MAE: {test_mae2}\n Test loss: ${test_loss2}")
