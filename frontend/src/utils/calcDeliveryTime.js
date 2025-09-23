export function calcDeliveryTime(date) {
    let expiryDate = new Date(date);
    let setExpiry = expiryDate.getTime() + 2 * 60 * 1000
    let newdate = new Date()

    let diff = setExpiry - newdate

    let diffM = diff / (1000 * 60)
    let diffS = diff / (1000)

    let time = `${diffM}|${diffS}`

    return parseInt(time)

} 