const all_test = [
    {
        "name": 'pdConnnect',
        "program": require('../database/testPDConnect'),
        'msg': 'connect success!'
    }
]



for (let obj of all_test) {
    obj['program']
    console.log(obj['msg'])
}


