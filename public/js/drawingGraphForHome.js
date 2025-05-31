const STOCK_ID_ALREADY_GET = new Set()
let msgGlobal = ''
const main = async (stock_id, val_loss_value, growth_rate_value) => {
    try {
        msgGlobal = 'RUNNING!'
        runAnimation()
        let req_body = JSON.stringify({
            stock_id: stock_id || [2330],
            val_loss_value: Number(val_loss_value) || 10**6,
            growth_rate_value: Number(growth_rate_value) || (-10)**6,

        })
    
        const getStockMarketData = await fetch(
            '/api/getStockMarketData', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: req_body
            }
    
        )
    
        const stockMarketData = await getStockMarketData.json()
        stockMarketData.map((obj) => STOCK_ID_ALREADY_GET.add(obj['stock_id']))
        console.log(STOCK_ID_ALREADY_GET)
        // const refer_result = await getStockName.json()
        
        let graph_container =  document.querySelector(`#graph-container`)
        for (let idx in stockMarketData) {
            
            let obj = stockMarketData[idx]
            // let ref_obj = refer_result[idx]
            let data = {
                real: obj['datasets']['real'],
                predict: obj['datasets']['predict']
        
            }
    
            let ctx = document.createElement('canvas')
            
            // ctx.id = `myChart_${idx}`
            // ctx.innerHTML = `<canvas id="myChart_${idx}" style="border: 10px solid black"></canvas>`
            ctx.innerHTML = `<canvas id="myChart_${idx}"></canvas>`
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
        
            // console.log(typeof obj['data_date'])

            const config = {
                "type": 'line',
                "data": data,
                line: {
                    borderWidth: 1
                },
                options: {
                    responsive: true,
                    // maintainAspectRatio: false, // Set to false for better scaling on small screens
                    // title: {
                    //     display: true,
                    //     text: 'Custom Chart Title'
                    // }
                    plugins: {
                        title: {
                            display: true,
                            // text: `Stock ID: ${obj['stock_id']}, Stock Name: ${ref_obj['Name']}`,
                            text: 
                            [
                                `Stock ID: ${obj['stock_id']}, Stock Name: ${obj['stock_name']}\n`,
                                `( Loss: ${Number(obj['loss_val']).toFixed(2)}, Growth Rate: ${Number((obj['day_5_prediction'] / obj['day_0_prediction'])).toFixed(2)}, Data Date: ${obj['data_date'].substring(0, 10)})`
                            ],
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
            new Chart(ctx, config)
        }

        msgGlobal = 'Success~!'
        killAnimation('anime1')


    } catch (err) {
        let function_name = 'drawingGraphForHome.js/main'
        console.error(`-----\t${function_name} occur some error\t-----`)

    }

   

}

const isNumber = (value) => {
    value = Number(value)
    return typeof(value) === 'number' && !isNaN(value)
}

const animationTaskList = {}
let animationCount = 0
const runAnimation = async () => {

    const msgBlock = document.querySelector('.msg-fun-but')
    msgBlock.innerText = msgGlobal
    msgBlock.style.display = 'flex'

    let dotMsg = ''
    let count = 0
    animationTaskList['task'] = setInterval(() => {

        count +=1 
        dotMsg += '.'
        msgBlock.innerText = msgGlobal + dotMsg


        if (count>5) {
            count = 0
            dotMsg = ''
        }
    }, 1000)


}

const killAnimation = async (task) => {
    const msgBlock = document.querySelector('.msg-fun-but')
    
    let opacity = 1
    const subTask = setInterval(() => {
        opacity -= 0.04
        msgBlock.style.opacity = opacity
        console.log(opacity)
        if (opacity < 0) {
            clearInterval(animationTaskList[task])
            clearInterval(subTask)
            msgBlock.style.display = 'none'

        }
    }, 100);

    // msgBlock.style.display = 'disable'
}


const submit_search = async (stock_id, val_loss, growth_rate) => {
    try {

        
        // event.preventDefault()
        let count = 0
        const stock_id_value = stock_id ? stock_id.join(',') : document.querySelector('#stock_id').value

        let val_loss_value =  val_loss ? Number(val_loss) : Number(document.querySelector('#val_loss').value)
        let growth_rate_value = growth_rate ? Number(growth_rate) : Number(document.querySelector('#growth_rate').value)

        let messageForWindowAlert = []
        if (!isNumber(val_loss_value)) {
            alert('val_loss got to be number')
        } else if (!isNumber(growth_rate_value)) {
            alert('growth_rate_value got to be number')
        } else {
            val_loss_value = Number(val_loss_value)
            growth_rate_value = Number(growth_rate_value)
            // These are checking stock_id
            let result = []
            let target_stock_id = stock_id_value.split(',').map( (val) => {
                    return val.trim()
                    })
            
            
            for (let val of target_stock_id) {
                if (val) {
                    if (STOCK_ID_ALREADY_GET.has(val)) {
                        messageForWindowAlert.push(val)
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

            }
            if (messageForWindowAlert != '') {
                alert((`TARGET ${messageForWindowAlert.join(', ')} ALREADY EXIST!`))

            }
            // if (result.length != 0) {
                main(result, val_loss_value, growth_rate_value)
            // }
        }

    } catch (err) {
        let function_name = 'drawingGraphForHome.js/submit_stock_id_search'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }
}


