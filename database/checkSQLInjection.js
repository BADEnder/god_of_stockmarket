const checkSQLInjection = (str) => {
    let result = ''
    for (let idx in str) {
        let elem = str[idx]
        if (elem === `'` ) {
            result += `'${elem}`
        } else {
            result += `${elem}`
        }
    }

    return result
}

module.exports = checkSQLInjection