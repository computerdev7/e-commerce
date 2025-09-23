import orderSchema from "../model/orderModel.js"

export async function getOrders(req, res) {
    let id = req.user._id
    let order = req.query.o

    try {
        let getOrders;
        if (order == 'all') {
            getOrders = await orderSchema.find({ user_id: id }).populate('product_id')
        } else {
            getOrders = await orderSchema.find({ user_id: id, user_state: order }).populate('product_id')
        }
        res.status(200).json({ message: getOrders })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function notAvailable(req, res) {
    let id = req.query.id

    try {
        let removeOrder = await orderSchema.findByIdAndDelete({ _id: id }, { new: true }).populate('product_id')
        res.status(201).json({ message: removeOrder })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function cancelOrder(req, res) {
    let id = req.query.id

    try {
        let cancelOrder = await orderSchema.findByIdAndUpdate({ _id: id }, { isCancelOrder: true }, { new: true }).populate('product_id')
        res.status(201).json({ message: cancelOrder })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function delivered(req, res) {
    let id = req.query.id

    try {
        let delivered = await orderSchema.findByIdAndUpdate({ _id: id }, { state: 'delivered', user_state: 'success' }, { new: true }).populate('product_id')
        res.status(201).json({ message: delivered })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function returned(req, res) {
    let id = req.query.id
    let returnFeedback = req.body.f

    try {
        let returnorder = await orderSchema.findByIdAndUpdate({ _id: id }, { state: 'packaged', user_state: 'refunded', vendor_state: 'refunded', refundfeedback: returnFeedback }, { new: true }).populate('product_id')
        console.log(returnorder)
        res.status(200).json({ message: returnorder })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}

export async function refunddelivery(req, res) {
    let id = req.query.id

    try {
        let delivery = await orderSchema.findByIdAndUpdate({ _id: id }, { state: 'on delivery' }, { new: true }).populate('product_id')
        res.status(200).json({ message: delivery })
    } catch (err) {

        res.status(500).json({ message: err })
    }
}