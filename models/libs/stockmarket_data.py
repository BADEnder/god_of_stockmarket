
import numpy as np
import pandas as pd
from FinMind.data import DataLoader


# def catch_data_from_finmind(stock_id, start_date, end_date, no_needed_columns, target_column):

#     dl = DataLoader()
#     stock_data = None
#     try:
#         # 下載台股股價資料
#         stock_data = dl.taiwan_stock_daily(
#             stock_id=stock_id, start_date=start_date, end_date=end_date
#         )
#     except:
#         print('Cannot get data of prices!!')

#     try:
#         # 下載三大法人資料
#         stock_data = dl.feature.add_kline_institutional_investors(
#             stock_data
#         )

#     except:
#         print('Cannot get data of investment from foreign!!')

#     try:
#         # 下載融資券資料
#         stock_data = dl.feature.add_kline_margin_purchase_short_sale(
#             stock_data
#         )
#     except:
#         print('Cannot get data of investment from banks!!')

#     date_array = pd.to_datetime(stock_data['date'])

#     target = stock_data[target_column].copy()

#     for col in stock_data.columns:
#         if col != target_column:
#             stock_data = stock_data.drop(axis=1, columns=[col])

#     features = stock_data

#     print('-------'*5, '\n')
#     print('FEATURE COLUMNS: \n', features.columns)
#     # print('TARGET COLUMNS: \n', target.columns)
#     print('-------'*5, '\n')

#     return features, target, date_array


# # Create time series windows
# def create_sequences(data, labels, time_steps=10):
#     X, y = [], []
#     for i in range(len(data) - time_steps):
#         X.append(data[i:i+time_steps])
#         y.append(labels[i+time_steps])

#     return np.array(X), np.array(y)
#     # for i in range(len(data) - time_steps):

#         # X.append(data[i:i+time_steps])
#         # y.append(labels[i+time_steps])


# Technical Indicator: RSI
def compute_rsi(data, window=14):
    delta = data.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window).mean()
    avg_loss = loss.rolling(window).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(0)

def catch_data_from_finmind(stock_id, start_date, end_date, drop_columns):

    dl = DataLoader()
    try:
        # 下載台股股價資料
        stock_data = dl.taiwan_stock_daily(
            stock_id=stock_id, start_date=start_date, end_date=end_date
        )
    except:
        print('Cannot get data of prices!!')

    # try:
    #     # 下載三大法人資料
    #     stock_data = dl.feature.add_kline_institutional_investors(
    #         stock_data
    #     )

    # except:
    #     print('Cannot get data of investment from foreign!!')

    # try:
    #     # 下載融資券資料
    #     stock_data = dl.feature.add_kline_margin_purchase_short_sale(
    #         stock_data
    #     )
    # except:
    #     print('Cannot get data of investment from banks!!')


    # 取得EPS資料（財報）
    fs = dl.taiwan_stock_financial_statement(
        stock_id=stock_id,
        start_date=start_date,
        end_date=end_date
    )
    eps_df = fs[fs['type'] == 'EPS'][['date', 'value']].rename(columns={'value': 'EPS'})
    eps_df['date'] = pd.to_datetime(eps_df['date'])

    # 取得每股淨值資料（資產負債表）
    bs = dl.taiwan_stock_balance_sheet(
        stock_id=stock_id,
        start_date=start_date,
        end_date=end_date
    )
    bvps_df = bs[bs['type'] == 'EquityAttributableToOwnersOfParent_per'][['date', 'value']] \
            .rename(columns={'value': 'BVPS'})
    bvps_df['date'] = pd.to_datetime(bvps_df['date'])

    # 將股票日資料轉為日期型態，並排序
    stock_data['date'] = pd.to_datetime(stock_data['date'])
    stock_data = stock_data.sort_values('date')

    merged_df = stock_data.copy()
    # 將EPS和BVPS合併到股價資料中
    # 先將EPS和BVPS merge 至股價資料上（左連結）
    # merged_df = stock_data.merge(eps_df, on='date', how='left')
    # merged_df = merged_df.merge(bvps_df, on='date', how='left')

    # 對EPS和BVPS做向前填補（forward-fill），因財報通常每季一次
    # merged_df[['EPS', 'BVPS']] = merged_df[['EPS', 'BVPS']].ffill()
    merged_df["RSI"] = compute_rsi(merged_df["close"], window=14)

    df = merged_df.dropna().reset_index(drop=True)



    ref_columns = set(df.columns)
    for col in drop_columns:
        if col in ref_columns:

            df = df.drop(columns=[col], axis=1)

    # 檢查最終結果
    print(df.tail(20))
    print('length:', len(df.columns))
    return df

# Create time series windows
def create_sequences(data, time_steps=10):
    X, y = [], []

    for i in range(len(data) - time_steps):
        X.append(data[i:i+time_steps])
        y.append(data[i+time_steps][:])

    X = np.array(X)
    y = np.array(y)

    return X, y



def reset_running_status():
    with open(f"./config/runningStatus.txt", 'w', encoding='utf-8') as status_file:
        status_file.write('0')
        print('reset status Success!')
