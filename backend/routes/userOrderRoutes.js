import express from "express"
import Razorpay from "razorpay"
import crypto from "crypto"
import CheckUserType from "../middleware/checkUserType.js"
import checkCookie from "../middleware/checkCookies.js"
import razorpay from "../index.js"
import ProductSchema from "../model/productModel.js"
import orderSchema from "../model/orderModel.js"

let route = express.Router();

route.post('/create-order', checkCookie, CheckUserType('user'), async (req, res) => {

    let id = req.body.id; 

    try {

        let findAndUpdate = await ProductSchema.find({ _id: id })

        const options = {
            amount: findAndUpdate[0].price * 100,
            currency: 'INR',
            receipt: 'receipt#1'
        }

        const order = await razorpay.orders.create(options)
        res.status(201).json({ message: order })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})


route.post('/check-order', checkCookie, CheckUserType('user'), async (req, res) => {
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
        let id = req.body.id;

        const generated_signature = crypto
            .createHmac("sha256", "jGWXRF5D6HbsNjgiatmEKUsL")
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex')

        if (generated_signature === razorpay_signature) {
            let findAndUpdate = await ProductSchema.findByIdAndUpdate({ _id: id }, { $inc: { quantity: -1 } })
            let addOrder = new orderSchema({
                vendor_id : findAndUpdate.product_owner,
                user_id : req.user._id,
                product_id : id,
                vendor_state : 'new order',
                user_state : 'new order',
                isRefunded : false,
            })

            let newOrder = await addOrder.save()

            res.status(200).json({ message: newOrder})
        } else {
            res.status(500).json({ message: 'failed' })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})

route.get('/getorders', checkCookie, CheckUserType('user') ,async (req,res)=> {

    let id = req.user._id
    let order = req.query.o

    try{
        let getOrders;
        if(order == 'all'){
            getOrders = await orderSchema.find({user_id : id}).populate('product_id')
        } else {
            getOrders = await orderSchema.find({user_id : id, user_state : order}).populate('product_id')
        }
        res.status(200).json({message : getOrders})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.delete('/notavailable',async(req,res)=> {

    let id = req.query.id

    try{
        let removeOrder = await orderSchema.findByIdAndDelete({_id : id})
        res.status(201).json({message : removeOrder})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.put('/cancelorder',async(req,res)=> {

    let id = req.query.id

    try{
        let cancelOrder = await orderSchema.findByIdAndUpdate({_id : id}, {isCancelOrder : true})
        res.status(201).json({message : cancelOrder})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.put('/delivered',async(req,res)=> {

    let id = req.query.id

    try{
        let delivered = await orderSchema.findByIdAndUpdate({_id: id}, {state : 'delivered', user_state : 'success'})
        res.status(201).json({message : delivered})
    } catch(err){
        res.status(500).json({message : err})
    }
})

route.post('/return',async(req,res)=> {

    let id = req.query.id
    let returnFeedback = req.body.f

    try{
        let returnorder = await orderSchema.findByIdAndUpdate({_id: id}, {state : 'packaged', user_state : 'refunded', vendor_state : 'refunded', refundfeedback : returnFeedback})
        res.status(200).json({message : returnorder})
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
})

route.put('/refunddelivery',async(req,res)=> {
    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {state : 'on delivery'})
         res.status(200).json({message : delivery})
    }catch(err){
        
        res.status(500).json({message : err})
    }

})

export default route