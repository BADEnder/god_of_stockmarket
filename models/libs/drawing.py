# Plot predictions vs actual

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Plot predictions vs actual for the first test sample
def plt_prediction_and_real_data_diff(x, y, y_predict, date_showed_for_real, date_showed_for_predict):
    y_real = y

    plt.figure(figsize=(12, 5))
    plt.plot(
        date_showed_for_predict, y_predict, label="Predict",
        marker="o", markersize=1,
        linestyle="dashed", linewidth=1, color='red'
        )
    plt.plot(
        date_showed_for_real, y, label="Actual",
        marker="o", markersize=1,
        linestyle="dashed", linewidth=1, color='blue')

    plt.legend()
    plt.title("Stock Price Prediction")
    plt.show()


def plt_correlation_heatmap_with_pandas_data(data):
    numerical_data = data.select_dtypes(include=['int64', 'float64'])
    print(numerical_data.columns)
    plt.figure(figsize=(16,12))
    sns.heatmap(numerical_data.corr(), annot=True, cmap='coolwarm')
    plt.title("Feature Correlation Heatmap")
    plt.show()


def plt_trend_of_close_money(data):
    converted_datetime = pd.to_datetime(data['date'])
    plt.figure(figsize=(18, 6))
    plt.plot(converted_datetime, data['close'])
    plt.show()

