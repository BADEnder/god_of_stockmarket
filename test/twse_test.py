from twse.stock_info import query_stock_info

# Query single stock (TSMC - 2330)
# response = query_stock_info("6620")
response = query_stock_info("2330")
print(response.pretty_repr())

# # Query multiple stocks (TSMC - 2330 and Hon Hai - 2317)
# response = query_stock_info(["2330", "2317"])
# print(response.pretty_repr())