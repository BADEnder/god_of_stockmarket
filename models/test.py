import sys

try:
    argv = sys.argv
    print('this is working')
    print(argv)


    from datetime import datetime as dt, timedelta as td, date


    years = 3
    time_steps = 5


    end_date = date.today()
    print('end_date: \n', end_date)

    start_date, end_date = (end_date - td(days=years*365)).strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')


    print('start_date: \n', start_date)
    print('end_date: \n', end_date)

except:
    print('some error happened')