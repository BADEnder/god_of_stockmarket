import os
import psycopg2
from fugle_marketdata import RestClient
from datetime import datetime, date
import time
from dotenv import load_dotenv
from libs.get_list import get_all_list, check_digit
load_dotenv()
# --- 設定區 ---

FUGLE_API_KEY = os.getenv("API_KEY")
DB_CONFIG = {
    'dbname': os.getenv("DB_DB"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PWD"),
    'host': os.getenv("DB_HOST"),
    'port': os.getenv("DB_PORT") or "5432"
}
# STOCK_LIST = ['2337', '2408', '3481', '2344'] # 你想追蹤的股票清單

# # 旺宏 2337
# # 南亞科 2408
# # 群創 3481
# # 華邦電 2344
# # print(FUGLE_API_KEY)
# # print(DB_CONFIG)




def get_buy_sell_data(stock_id, stock_name):
    client = RestClient(api_key=FUGLE_API_KEY)
    try:
        # 抓取當日分價量 (Volumes)
        


        vols = client.stock.intraday.volumes(symbol=stock_id)
        
        today = vols.get('date')
        stock = client.stock
        histroy_data = stock.historical.candles(**{"symbol": stock_id, "from": today, "to": today, "fields": "open,high,low,close,volume,change"})
        histroy_data = histroy_data['data'][0]
        price_change_ratio = ( float(histroy_data['change']) / (float(histroy_data['close']) - float(histroy_data['change'])) ) 
        price_change_ratio = round(price_change_ratio*100, 2)

        data = vols.get('data', [])
        
        buy_vol = sum(entry.get('volumeAtBid', 0) for entry in data)
        sell_vol = sum(entry.get('volumeAtAsk', 0) for entry in data)
        
        ratio = 0
        if (buy_vol + sell_vol) > 0:
            ratio = round((sell_vol / (buy_vol + sell_vol)) * 100, 2)
            

        return {
            'date': vols.get('date'),
            'stock_id': stock_id,
            'stock_name': stock_name,
            'price_change_ratio': price_change_ratio,
            'close_price': histroy_data['close'],
            'trade_volume': histroy_data['volume'],
            'buy_vol': buy_vol,
            'sell_vol': sell_vol,
            'ratio': ratio
        }
    except Exception as e:
        print(f"抓取 {stock_id} 失敗: {e}")
        return None

def save_to_db(result):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    sql = """
        INSERT INTO stock_buy_sell_ratio (
            date,
            stock_id,
            stock_name,
            price_change_ratio,
            close_price,
            trade_volume,
            buy_volume,
            sell_volume,
            external_ratio)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (date, stock_id) DO UPDATE SET
            price_change_ratio = EXCLUDED.price_change_ratio,
            close_price = EXCLUDED.close_price,
            trade_volume = EXCLUDED.trade_volume,
            buy_volume = EXCLUDED.buy_volume,
            sell_volume = EXCLUDED.sell_volume,
            external_ratio = EXCLUDED.external_ratio,
            created_at = NOW()
            ;
    """
    try:
        cur.execute(sql, (
            result['date'],
            result['stock_id'],
            result['stock_name'],
            result['price_change_ratio'],
            result['close_price'],
            result['trade_volume'],
            result['buy_vol'],
            result['sell_vol'],
            result['ratio'])
        )
        conn.commit()
    except Exception as e:
        print(f"寫入資料庫失敗: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    print(f"開始執行任務: {datetime.now()}")
    STOCK_LIST = []
    data = get_all_list()
    for i, obj in enumerate(data):
        if obj['TradeVolume'].strip() != '':
            if float(obj['TradeVolume']) >= (10**6) and check_digit(obj['Code']):

                price_change_ratio = ( float(obj['Change']) / (float(obj['ClosingPrice']) - float(obj['Change'])) ) 
                price_change_ratio = round(price_change_ratio*100, 2)

                STOCK_LIST.append({
                    'stock_id': obj['Code'], 
                    'stock_name': obj['Name'],
                })
    while STOCK_LIST:
        s = STOCK_LIST.pop(0)
    
        res = get_buy_sell_data(
            s['stock_id'], 
            s['stock_name']
        )
        if res:
            save_to_db(res)
            print(f"""
                  成功更新: (剩餘數量: {len(STOCK_LIST)}) 
                  ----------------------------------------------------------------
                  股票ID: {s['stock_id']}, 股票名稱: {s['stock_name']} 漲幅: {res['price_change_ratio']}% 外盤比: {res['ratio']}%
                  ----------------------------------------------------------------
                  """
                )

        time.sleep(2)

