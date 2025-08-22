
const main = async () => {


    const req_body = JSON.stringify( 
    {
        // stock_id: '2130'
    })

    // console.log(req_body)
    let fetch_data = await fetch(
        '/api/get_home_data', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: req_body
        }
    )


    fetch_data = await fetch_data.json()


    const content_container = document.querySelector('#content_container')

    fetch_data.forEach((item, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${Number(idx) + 1}</td>
        <td>${item.data_date}</td>
        <td><a class="a" target="_blank" href="/stock_price_trend?stock_id=${item.stock_id}">${item.stock_id}</a></td>
        <td>${item.stock_name}</td>
        <td>${parseFloat(item.groth_rate_5_days).toFixed(2)}%</td>
        <td>${parseFloat(item.groth_rate_10_days).toFixed(2)}%</td>
        `;
        content_container.appendChild(row);
    });
}

main()

const init = () => {
    const params = new URLSearchParams(window.location.search);
    const stock_id = params.get('stock_id');
    // console.log('Stock ID from URL:', stockId);
    if (stock_id) {
        document.querySelector('#stock_id').value = stock_id
    }
    document.querySelector('#submit').click()
}

init()