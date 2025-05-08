const showTenMillionTradeVolume = async () => {
    let req_body = JSON.stringify({
        enoughTenMillionTradeVolume: 'Y'
    })

    let firstResult = await fetch(
        '/api/getTopInfo', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            query: req_body
        }

    )

    firstResult = await firstResult.json(firstResult)

    console.warn(firstResult)

    firstResult = changeJsonToStr(firstResult)

    main(firstResult)
    // let finalResult = await fetch(
    //     '/api/getStockMarketData', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: firstResult
    //     }

    // )

    // finalResult = await finalResult.json(finalResult)
    // console.warn(finalResult)

}

const changeJsonToStr = (data) => {
    return data.map(val => {
        return val['Code']
    })
}