from fmd import FmdApi


# 漢達生技
# stock_id = '6620'
# TSMC
stock_id = '2330'

# 陽明
# stock_id = '2609'

fa = FmdApi()
stock = fa.stock.get(symbol=stock_id)
data = stock.get_price()



for obj in data:
    for key, val in obj.items():
        print(key, ' : ', val)
    
    print('-----')

# print(data)