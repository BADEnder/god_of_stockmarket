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
    print('nothing')
    # result = run_select_query('SELECT * FROM models')   
    # print(result)
    # query = "DELETE FROM models"
    # result = run_change_query(query)   

