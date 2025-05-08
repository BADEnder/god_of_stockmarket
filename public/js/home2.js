const showMillionTradeVolume = async () => {
    let req_body = {
        enoughMillionTradeVolume: 'Y'
    }

    const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
    console.log(api)
    let getTopData = await fetch(
        api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }

    )

    getTopData = await getTopData.json(getTopData)

    console.warn(getTopData)

    getTopData = changeJsonToStr(getTopData)

    main(getTopData)

}

const showTenMillionTradeVolume = async () => {
    let req_body = {
        enoughTenMillionTradeVolume: 'Y'
    }

    const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
    console.log(api)
    let getTopData = await fetch(
        api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }

    )

    getTopData = await getTopData.json(getTopData)

    console.warn(getTopData)

    getTopData = changeJsonToStr(getTopData)

    main(getTopData)

}
const showHundredMillionTradeVolume = async () => {
    let req_body = {
        enoughHundredMillionTradeVolume: 'Y'
    }

    const api = `/api/getTopInfo?${Object.keys(req_body)[0]}=${Object.values(req_body)[0]}`
    console.log(api)
    let getTopData = await fetch(
        api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }

    )

    getTopData = await getTopData.json(getTopData)

    console.warn(getTopData)

    getTopData = changeJsonToStr(getTopData)

    main(getTopData)

}



const changeJsonToStr = (data) => {
    return data.map(val => {
        return val['Code']
    })
}