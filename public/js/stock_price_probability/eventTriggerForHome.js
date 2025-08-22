const submitButton = document.querySelector('#submit')

let key_arr = ['stock_id']

for (let key of key_arr) {
    document.querySelector(`#${key}`).addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {submitButton.click()}
    })
}
