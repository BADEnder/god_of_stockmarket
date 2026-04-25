import { format } from 'https://cdn.skypack.dev/date-fns';

const init = () => {


    const start_date_element = document.querySelector('#start_date')
    const end_date_element = document.querySelector('#end_date')

    let start_date = new Date()
    let end_date = new Date()
    start_date.setMonth(start_date.getMonth()-1)

    start_date_element.value = format(start_date, 'yyyy-MM-dd')
    end_date_element.value = format(end_date, 'yyyy-MM-dd') 
}


init()
