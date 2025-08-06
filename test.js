let a = [1,2,3]

// let b = a.slice(-1)

// console.log(b)


// for (i=1; i<10; i++) {
//     console.log(i)
// }



a = a.map((val, idx) => {
    return {
        x: idx,
        y: val
    }
})


console.log(a)