
const search_data = async () => {
    const stock_id = document.querySelector('#stock_id').value
    const start_date = document.querySelector('#start_date').value
    const end_date = document.querySelector('#end_date').value

    const require_body = {
        'stock_id': stock_id,
        'start_date': start_date,
        'end_date': end_date
    }

    console.log(require_body)

    let fetch_data = await fetch(
        '/api/histroyData', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(require_body)
        }
    )

    let result = await fetch_data.json()
    const content_container = document.querySelector('#content_container')

    result.forEach((item, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.date}</td>
        <td>${item.stock_id}</td>
        <td>${item.stock_name}</td>
        <td>${item.price_change_ratio}</td>
        <td>${item.external_ratio}</td>
        <td>${item.close_price}</td>
        <td>${item.trade_volume}</td>
        `;
        content_container.appendChild(row);
    });
    console.log(result)
}
