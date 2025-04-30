let a = [1745280000000000000, 1745280000000000000]



let b =a.map(val => {
    return new Date(val / 1000000)
})

console.log(b)


// console.log(new Date([1,2,3]))