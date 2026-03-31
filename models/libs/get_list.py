import requests

url = 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'
response = requests.get(url)

# 檢查狀態碼 (200 代表成功)

def get_all_list():
    if response.status_code == 200:
        data = response.json()  # 將 JSON 格式的回傳值轉為 Python 字典
        return(data)
    

def check_digit(char):
    if char.isdigit() and str(int(char)) == char:
        return True
    
    return False