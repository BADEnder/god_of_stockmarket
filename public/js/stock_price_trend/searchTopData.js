const showMillionTradeVolume = async () => {
    try { 

    let req_body = {
        enoughMillionTradeVolume: 'Y'
    }

    const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
    let getTopData = await fetch(
        api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }

    )

    getTopData = await getTopData.json(getTopData)
    getTopData = changeJsonToStr(getTopData)

    submit_search(getTopData, 10**6, 0.01)
    document.querySelector("#showMillionTradeVolume").disabled  = true

    } catch (err) {
        let function_name = 'searchTopData.js/showMillionTradeVolume'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }
}

const showTenMillionTradeVolume = async () => {
    try {
        
    
        let req_body = {
            enoughTenMillionTradeVolume: 'Y'
        }

        const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
        let getTopData = await fetch(
            api, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }

        )

        getTopData = await getTopData.json(getTopData)
        getTopData = changeJsonToStr(getTopData)

        submit_search(getTopData, 10**6, 0.01)
        document.querySelector("#showTenMillionTradeVolume").disabled  = true

    } catch (err) {
        let function_name = 'searchTopData.js/showTenMillionTradeVolume'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }

}
const showHundredMillionTradeVolume = async () => {
    try {
        
        let req_body = {
            enoughHundredMillionTradeVolume: 'Y'
        }

        const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
        let getTopData = await fetch(
            api, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }

        )

        getTopData = await getTopData.json(getTopData)
        getTopData = changeJsonToStr(getTopData)

        submit_search(getTopData, 10**6, 0.01)
        document.querySelector("#showHundredMillionTradeVolume").disabled  = true

    } catch (err) {
        let function_name = 'searchTopData.js/showHundredMillionTradeVolume'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }

}



const changeJsonToStr = (data) => {
    try {
        return data.map(val => {
            return val['Code']
        })

    } catch (err) {
        let function_name = 'searchTopData.js/changeJsonToStr'
        console.error(`-----\t${function_name} occur some error\t-----`)
    }

}