        SELECT MAIN.*

            FROM models AS MAIN

        JOIN (
            SELECT stock_id, MAX(data_date) AS data_date
            FROM models AS MAIN
            GROUP BY stock_id
        ) AS REF
        ON REF.stock_id = MAIN.stock_id
        AND REF.data_date = MAIN.data_date
        
        WHERE 1=1