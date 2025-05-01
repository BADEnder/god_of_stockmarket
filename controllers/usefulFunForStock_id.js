const checkout_stock_id_type_and_filter_repeat = (stock_id_sets) => {
    if (typeof(stock_id_sets) == 'string' ||
        typeof(stock_id_sets) == 'number' 
        ) {
        stock_id_sets = [String(stock_id_sets)]
    } else if (!Array.isArray(stock_id_sets)) {
        return null
    }

    let non_repeat_stock_sets = []
    let check_repaet_data_set = new Set()
    
    for (stock_id of stock_id_sets) {
        if (!check_repaet_data_set.has(stock_id)) {
            non_repeat_stock_sets.push(stock_id)
            check_repaet_data_set.add(stock_id)
        }
    }
    
    return non_repeat_stock_sets
}

module.exports = {
    checkout_stock_id_type_and_filter_repeat
}