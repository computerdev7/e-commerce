import express from "express"
import orderSchema from "../model/orderModel.js"
import checkCookie from "../middleware/checkCookies.js"
import CheckUserType from "../middleware/checkUserType.js"
import ProductSchema from "../model/productModel.js"

let route = express.Router();

// pagination on vendor

route.get('/getorders',checkCookie, CheckUserType('vendor'), async(req, res)=> {
    
    let id = req.user._id
    let custId = JSON.stringify(id).slice(1,-1)
    let order = req.query.o

    try{
        let getOrders;
        if(order == 'all'){
            getOrders = await orderSchema.find({vendor_id : custId}).populate('product_id')
        } else {
            getOrders = await orderSchema.find({vendor_id : custId, vendor_state : order}).populate('product_id')
        }

        res.status(200).json({message : getOrders})

    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
})

route.put('/setavailable', async(req,res)=> {

    let id = req.query.id
    let cond = req.query.cond

    console.log(cond, typeof(cond))

    try{
        let setavailable;

        if(cond != 'false'){
            setavailable = await orderSchema.findByIdAndUpdate({_id : id},{available : cond, state : 'packaging'})
        } else {
            setavailable = await orderSchema.findByIdAndUpdate({_id : id},{available : cond})
        }


        res.status(201).json({message : setavailable})

    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }

})

route.put('/packaged',async (req,res)=> {

    let id = req.query.id

    try{
        let data = await orderSchema.findByIdAndUpdate({_id : id},{state : 'packaged'})
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
})

route.delete('/confirmordercancel',async(req,res)=> {

    let id = req.query.id

    try{
        let removeOrder = await orderSchema.findByIdAndDelete({_id : id})
        res.status(201).json({message : removeOrder})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.put('/delivery',async(req,res)=> {

    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {state : 'on delivery', vendor_state : 'success'})
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.put('/getdelivery',async(req,res)=> {

    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {state : 'delivered'})
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
})

route.put('/refunddelivered',async(req,res)=> {
     let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {isRefunded : true})
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
})

export default route;