const STOCK_ID_ALREADY_GET = new Set()


const main = async function(stock_id) {


    let req_body = JSON.stringify({
        stock_id: stock_id || [2330]
        // stock_id: [2330, 2337, 6220]
        // stock_id: [2330, 2337]
        // stock_id: [2337]
        
    })

    console.log(req_body)
    const getData = await fetch(
        '/api/getStockMarketData', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: req_body
        }

    )

    // let seach_name_body = {
    //     stock_id: stock_id
    // }
    const getStockName = await fetch(
        '/api/getOtherInfoForStockMarket', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: req_body
        }

    )

    // console.warn('req_body:', req_body)


    
    const final_result = await getData.json()
    const refer_result = await getStockName.json()

    // console.warn('final_result: ', final_result)
    // console.warn('refer_result: ', refer_result)

    let graph_container =  document.querySelector(`#graph-container`)
    for (let idx in final_result) {
        
        let obj = final_result[idx]
        let ref_obj = refer_result[idx]
        let data = {
            real: obj['datasets']['real'],
            predict: obj['datasets']['predict']
    
        }

        let ctx = document.createElement('canvas')
        // ctx.id = `myChart_${idx}`
        // ctx.innerHTML = `<canvas id="myChart_${idx}" style="border: 10px solid black"></canvas>`
        ctx.innerHTML = `<canvas id="myChart_${idx}" width="600" height="300" aria-label="Hello ARIA World" role="img"></canvas>`
        graph_container.appendChild(ctx)
        ctx = ctx.getContext('2d')
        
        // ctx = document.querySelector(`#myChart_${idx}`).getContext('2d')
    
        data = {
            datasets: [
                {
                    label: `Real Data`,
                    data: data['real'],
                    backgroundColor: `rgba(255, 0, 188, 1)`,
                    // borderWidth: 5
    
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
                        text: `Stock ID: ${obj['stock_id']}, Stock Name: ${ref_obj['Name']}`,
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
                    },

                },
                elements: {
                    point: {
                        radius: 2,
                        pointStyle: 'triangle'
                    }
                },
                layout: {
                    padding: 20
                }
            }
    
        }
        // console.log(config)
        new Chart(ctx, config)
    }

}



const submit_stock_id_search = async (event) => {
    
    // event.preventDefault()
    let count = 0
    const stock_id_sets = document.querySelector('#stock_id')
    let result = []
    let target_stock_id = stock_id_sets.value.split(',').map( (val) => {
            return val.trim()
            })

    for (let val of target_stock_id) {
        if (STOCK_ID_ALREADY_GET.has(val)) {
            alert(`TARGET ${val} ALREADY EXIST!`)
        } else {
            result.push(val)
            STOCK_ID_ALREADY_GET.add(val)
            count += 1
        }

        if (count > 10) {
            alert('GIVE TOO MANY STOCK_IDs')
            break
        }
    }
    stock_id_sets.value = ''
    if (result.length != 0) {
        main(result)
    }

}


// main()