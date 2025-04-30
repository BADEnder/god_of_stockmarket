
const main = async function() {


    let req_body = JSON.stringify({
        stock_id: [2330, 2337, 6220, 6620]
        // stock_id: [2330, 2337, 6220]
        // stock_id: [2330, 2337]
        // stock_id: [2337]
    })
    // console.log(req_body)
    const getData = await fetch(
        'http://127.0.0.1/api/getStockMarketDataRoute', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: req_body
        }

    )


    
    const final_result = await getData.json()

    // final_result[0]['x_predict'] = final_result[0]['x_predict'].map((val) => {return new Date(val / 1000000)})
    // final_result[0]['x_real'] = final_result[0]['x_real'].map((val) => {return new Date(val / 1000000)})

    console.warn('final_result: ', final_result)

    for (let idx in final_result) {
        let obj = final_result[idx]
        let data = {
            real: obj['datasets']['real'],
            predict: obj['datasets']['predict']
    
        }
        let ctx = document.querySelector(`#myChart_${idx}`).getContext('2d')
    
        data = {
            datasets: [
                {
                    label: `Real Data`,
                    data: data['real'],
                    backgroundColor: `rgba(255, 0, 188, 1)`,
                    // borderWidth: 0.1
    
                    // borderColor: `rgb(15, 165, 102)`,
                },
                {
                    label: `Model Prediction`,
                    data: data['predict'],
                    backgroundColor: `rgba(${0}, 203, 188, 1)`,
                    // borderWidth: 0.1
    
                    // borderColor: `rgb(15, 165, 102)`,
                },
            ]
        }
    
    
        const config = {
            "type": 'line',
            "data": data,
            line: {
                borderWidth: 1
            },
            options: {
                
            // title: {
            //     display: true,
            //     text: 'Custom Chart Title'
            // }
            plugins: {
                title: {
                    display: true,
                    text: `Stock ID: ${obj['stock_id']}`,
                    font: {
                        size: 24,
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                    unit: 'day',
                    // tooltipFormat: 'yyyy-MM-dd'
                    },
                    title: {
                    display: true,
                    text: 'Date'
                    }, 
                    grid: {
                    display: false
                    },
                    ticks: {
                    maxTicksLimit: 7
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                    display: true,
                    text: 'Value'
                    }
                }
            },
            elements: {
                point: {
                    radius: 2,
                    pointStyle: 'triangle'
                }
                }
            }
    
        }
        new Chart(ctx, config)
    }

}

main()