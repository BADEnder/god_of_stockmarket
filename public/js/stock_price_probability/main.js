let STOCK_ID_ALREADY = ''
const animationTaskList = {}
let msgGlobal = ''


const runAnimation = async () => {
    // console.warn(Object.keys(animationTaskList))
    if (Object.keys(animationTaskList).length>0) return

    const msgBlock = document.querySelector('.msg-fun-but')
    msgBlock.innerText = msgGlobal
    msgBlock.style.display = 'flex'

    // console.log(animationTaskList)
    let dotMsg = ''
    let count = 0
    animationTaskList['anime1'] = setInterval(() => {

        count +=1 
        dotMsg += '.'
        msgBlock.innerText = msgGlobal + dotMsg


        if (count>5) {
            count = 0
            dotMsg = ''
        }
        // console.log('sec', new Date().getSeconds())
    }, 1000)


}

const killAnimation = async (task) => {
    const msgBlock = document.querySelector('.msg-fun-but')
    
    let opacity = 1
    const subTask = setInterval(() => {
        opacity -= 0.04
        msgBlock.style.opacity = opacity
        // console.log(opacity)
        if (opacity < 0) {
            // console.log('task:', task)
            clearInterval(animationTaskList[task])
            delete animationTaskList[task]
            clearInterval(subTask)
            msgBlock.style.display = 'none'

        }
    }, 100);

    // msgBlock.style.display = 'disable'
}


const submit_search = async (stock_id) => {
    try {

        
        const stock_id_value = stock_id ? stock_id.join(',') : document.querySelector('#stock_id').value.trim()

        if (stock_id_value == STOCK_ID_ALREADY) {
            alert(`${stock_id_value} already shown!`)
        } else {
            STOCK_ID_ALREADY = stock_id_value
        }

        main(stock_id_value)
    
    } catch (err) {
        let function_name = '/js/stock_price_probability/main.js/submit_stock_id_search'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }
}

const showGraph = (data) => {
    let graph_container =  document.querySelector(`#graph-container`)
    let title =  document.querySelector(`#title`)
    
    title.innerHTML = 
    `
        <div >
            <div class="center" style="font-size:32pt;"> Stock ID: ${data['stock_id']}</div>
            <div class="center" style="font-size:32pt;"> Stock Name: ${data['stock_name']} </div>
        </div>
    `
    graph_container.innerHTML = ''
    // data = data.slice(0, 1)
    data = data['predict_data']
    for (let idx in data) {
        let row = data[idx]

        let ctx = document.createElement('canvas')
        graph_container.appendChild(ctx)
        ctx = ctx.getContext('2d')


        //  ctx = document.getElementById('myChart').getContext('2d')
        const x = row['edges'].map((val, idx) => {
            if (idx != row['edges'].length-1) {
                // console.warn((row['edges'][idx] + row['edges'][idx+1]) / 2)
                return ((row['edges'][idx] + row['edges'][idx+1]) / 2).toFixed(2)}

            }
        ).slice(0, -1)
        const y = row['probability']
        
        console.log(y)

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: x.map(String),  // convert x to strings for axis labels
            datasets: [{
                label: `Day: ${Number(idx)+1}`,
                data: y,
                backgroundColor: `rgba(${Number(idx)*2}, ${Number(idx)*10}, ${Number(idx)*5}, 0.6)`,
                borderColor: `rgba(${Number(idx)*2}, ${Number(idx)*10}, ${Number(idx)*5}, 1)`,
                // backgroundColor: `rgba(75, 192, 192, 0.6)`,
                // borderColor: `rgba(75, 192, 192, 1)`,
                borderWidth: 1
            }]
            },
            options: {

            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Price'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }, 
                    ticks: {
                        callback: function(value) {
                            return Number.isInteger(value) ? value: ''
                        }
                    }
                }
            }
            }
        })
    }
    

}
const main = async (stock_id) => {
    try {
        msgGlobal = 'Search Ruuning'
            // runAnimation()

            let req_body = JSON.stringify({
                stock_id: stock_id
            })

            console.log('req_body:', req_body)
            const getStockMarketData = await fetch(
                '/api/get_probability_data', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: req_body
                }

            )

            result = await getStockMarketData.json()

            showGraph(result[0])
            console.log(result[0])
            // killAnimation('anime1')
    } catch (err) {
        console.log('err.name', err.name)
    }
   
}
