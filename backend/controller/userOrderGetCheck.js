import crypto from "crypto"
import razorpay from "../index.js"
import ProductSchema from "../model/productModel.js"
import orderSchema from "../model/orderModel.js"

export async function createOrder( req, res ){

    let id = req.body.id;
    let quantity = req.body.quantity

    try {

        let findAndUpdate = await ProductSchema.find({ _id: id })

        if (findAndUpdate[0].quantity < quantity) return res.status(400).json({ message: 'quantity is more than the inventory' })
        const options = {
            amount: findAndUpdate[0].price * 100 * quantity,
            currency: 'INR',
            receipt: 'receipt#1'
        }

        const order = await razorpay.orders.create(options)
        res.status(201).json({ message: order })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}

export async function checkOrder(req, res) {
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
        let id = req.body.id;
        let quantity = req.body.quantity

        const generated_signature = crypto
            .createHmac("sha256", "jGWXRF5D6HbsNjgiatmEKUsL")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex')

        if (generated_signature === razorpay_signature) {
            let findAndUpdate = await ProductSchema.findByIdAndUpdate({ _id: id }, { $inc: { quantity: -quantity } })
            let addOrder = new orderSchema({
                vendor_id: findAndUpdate.product_owner,
                user_id: req.user._id,
                product_id: id,
                vendor_state: 'new order',
                user_state: 'new order',
                isRefunded: false,
                quantity : quantity
            })

            let newOrder = await addOrder.save()

            res.status(200).json({ message: newOrder })
        } else {
            res.status(500).json({ message: 'failed' })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}