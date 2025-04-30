# 取得股價
from FinMind.data import DataLoader
from FinMind import plotting

from matplotlib import pyplot as plt

from sklearn.linear_model import LinearRegression

import time
import pandas as pd
import numpy as np
# 漢達生技
# stock_id = '6620'
# TSMC
stock_id = '2330'

# 陽明
# stock_id = '2609'

start_date = '2024-02-01'
end_date = '2025-02-01'

def catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, target):

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



    return stock_data

def save_data_into_csv_file(data, filename=None):
    if not filename:
        filename = 'temp.csv'
    data.to_csv(filename, columns=data.columns)



stock_data = catch_data_from_finmind(stock_id)
filename = f'data/{stock_id}_from_{start_date}_to_{end_date}.csv'
save_data_into_csv_file(stock_data, filename)

# 繪製k線圖 into .html (kline.html)
# plotting.kline(stock_data)
# print(type(stock_data))

print('-----\n' *3)
print('columns: \n',stock_data.columns)
print('heads: \n',stock_data.head())
print('tail: \n',stock_data.tail())
print('-----\n' *3)

days = []
for idx, val in enumerate(stock_data['close']):
    days.append(idx+1)
x, y = np.array(days).reshape(-1, 1), stock_data['close'].values


# x, y = stock_data['date'], stock_data['close']
plt.plot(x, y)
plt.show()

# print(stock_data)

