
import numpy as np
import pandas as pd
from FinMind.data import DataLoader


def catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, target_column):

    dl = DataLoader()
    stock_data = None
    try:
        # 下載台股股價資料
        stock_data = dl.taiwan_stock_daily(
            stock_id=stock_id, start_date=start_date, end_date=end_date
        )
    except:
        print('Cannot get data of prices!!')

    try:
        # 下載三大法人資料
        stock_data = dl.feature.add_kline_institutional_investors(
            stock_data
        )

    except:
        print('Cannot get data of investment from foreign!!')

    try:
        # 下載融資券資料
        stock_data = dl.feature.add_kline_margin_purchase_short_sale(
            stock_data
        )
    except:
        print('Cannot get data of investment from banks!!')

    date_array = pd.to_datetime(stock_data['date'])

    target = stock_data[target_column].copy()

    for col in stock_data.columns:
        if col != target_column:
            stock_data = stock_data.drop(axis=1, columns=[col])

    features = stock_data

    print('-------'*5, '\n')
    print('FEATURE COLUMNS: \n', features.columns)
    # print('TARGET COLUMNS: \n', target.columns)
    print('-------'*5, '\n')

    return features, target, date_array


# Create time series windows
def create_sequences(data, labels, time_steps=10):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i+time_steps])
        y.append(labels[i+time_steps])

    return np.array(X), np.array(y)
    # for i in range(len(data) - time_steps):

        # X.append(data[i:i+time_steps])
        # y.append(labels[i+time_steps])