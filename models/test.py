# import sys

# try:
#     argv = sys.argv
#     print('this is working')
#     print(argv)

#     for arg in argv:
#         print(arg.encode('utf-8').decode('utf-8'))
#         print(arg.encode('utf-8'))
#         print(arg.decode('utf-8'))


#     # from datetime import datetime as dt, timedelta as td, date


#     # years = 3
#     # time_steps = 5


#     # end_date = date.today()
#     # print('end_date: \n', end_date)

#     # start_date, end_date = (end_date - td(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')


#     # print('start_date: \n', start_date)
#     # print('end_date: \n', end_date)

# except:
#     print('some error happened')


# # import sys

# # import os 
# # # print(sys.path)
# # current_path = os.getcwdb()
# # print(current_path)


# from libs.postgre_connect import run_query
# result = run_query('SELECT stock_id, data_date, major_contents FROM models')   


result = [{
    'name': 'Ender',
    'age': 28
}]


def transfer_value_to_sql(arr):
    for idx, obj in enumerate(arr):
        for key, val in obj.items():
            if type(val) == str:
                obj[key] = f"'{val}'"
            else:
                obj[key] = f"{val}"

transfer_value_to_sql(result)

print(result)
table_name = 'models'


query = f"INSERT INTO {table_name} ({', '.join(result[0].keys())}) VALUES({', '.join(result[0].values())})"

print(query)
# print(test.items().join(','))
# print(type(test.keys()))
# print(test.keys())
# print(test.keys().join(','))