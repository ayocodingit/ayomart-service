const calculateDiscount = (price: number, discount: number) => {
    const voucher = (price / 100) * discount
    return voucher
}

const DealDiscount = (qty: number, multiple = 2, discount = 1000) => {
    return Math.floor(qty / multiple) * discount
}

function ThresholdDiscount(qty: number, min = 2, discount = 1000) {
    let voucher = 0
    if (qty >= min) voucher = discount * qty

    return voucher
}

export default {
    DealDiscount,
    ThresholdDiscount,
    calculateDiscount,
}
