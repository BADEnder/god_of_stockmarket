import psycopg2
import os

from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
config = {
    "DB_DB": os.getenv("DB"),
    "DB_USER": os.getenv("DB_USER"),
    "DB_PWD": os.getenv("DB_PWD"),
    "DB_HOST": os.getenv("DB_HOST"),
    "DB_PORT": os.getenv("DB_PORT") or "5432",
}
def run_change_query(query):
    
    try:
        conn = psycopg2.connect(
        dbname = os.getenv("DB_DB"),
        user = config["DB_USER"],
        password = config["DB_PWD"],
        host = config["DB_HOST"],
        port = config["DB_PORT"] or "5432"
        )

        cur = conn.cursor()
        cur.execute(query)
        conn.commit()
        cur.close()
        conn.close()
    except:
        print('function run_change_query FAIL!')

def run_select_query(query):
    
    try:
        conn = psycopg2.connect(
        # dbname = os.getenv("DB_HOSTDB_DB"),
        user = config["DB_USER"],
        password = config["DB_PWD"],
        host = config["DB_HOST"],
        port = config["DB_PORT"] or "5432"
        )


        cur = conn.cursor()
        cur.execute(query)

        rows = cur.fetchall()
        # print('here you go2')

        if rows:

            # Get column names
            col_names = [desc[0] for desc in cur.description]

            # Combine column names and rows
            for idx, row in enumerate(rows):
                rows[idx] = dict(zip(col_names, row))


        cur.close()
        conn.close()
        return rows
    except:
        print('function run_select_query FAIL!')


def transfer_value_to_sql(arr):
    for idx, obj in enumerate(arr):
        for key, val in obj.items():
            # print(key, val)
            if type(val) == int or type(val) == float:
                obj[key] = f"{val}"
            else:
                obj[key] = f"'{val}'"


if __name__ == "__main__":
    # result = run_select_query('SELECT * FROM models')   
    # print(result)
    query = "INSERT INTO models (stock_id, stock_name, loss_val, data_date, x_real, x_predict, y_real, y_predict) VALUES('2421', 'None', 8666.271484375, '2025-05-14', '[1746576000000000000, 1746662400000000000, 1746748800000000000, 1747008000000000000, 1747094400000000000]', '[1746576000000000000, 1746662400000000000, 1746748800000000000, 1747008000000000000, 1747094400000000000, 1747267200000000000, 1747353600000000000, 1747440000000000000, 1747526400000000000, 1747612800000000000, 1747699200000000000, 1747785600000000000, 1747872000000000000, 1747958400000000000, 1748044800000000000, 1748131200000000000, 1748217600000000000, 1748304000000000000, 1748390400000000000, 1748476800000000000, 1748563200000000000, 1748649600000000000, 1748736000000000000, 1748822400000000000, 1748908800000000000, 1748995200000000000, 1749081600000000000, 1749168000000000000, 1749254400000000000, 1749340800000000000, 1749427200000000000, 1749513600000000000, 1749600000000000000, 1749686400000000000, 1749772800000000000]', '[88.8, 89.7, 94.0, 94.9, 98.0]', '[0.06406834721565247, 0.06000073626637459, 0.05057356879115105, 0.04720034450292587, 0.028508849442005157, 0.0541728176176548, 0.08836957812309265, 0.11923274397850037, 0.15841712057590485, 0.1916385143995285, 0.1355353742837906, 0.11679747700691223, 0.10585378855466843, 0.0982607826590538, 0.09243380278348923, 0.0878559872508049, 0.08414700627326965, 0.0810650885105133, 0.0784277617931366, 0.07614351809024811, 0.07413957267999649, 0.07236272096633911, 0.0707729160785675, 0.06933943927288055, 0.06803818047046661, 0.0668499544262886, 0.06575926393270493, 0.0647534430027008, 0.06382203847169876, 0.0629386380314827, 0.062105800956487656, 0.06132661551237106, 0.06059557572007179, 0.059907905757427216, 0.059259504079818726]')"
    result = run_change_query(query)   
    # query = "DELETE FROM models"
    # result = run_change_query(query)   

