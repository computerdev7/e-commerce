import orderSchema from "../model/orderModel.js"

export async function getOrders(req,res){
    let id = req.user._id
    let custId = JSON.stringify(id).slice(1,-1)
    let order = req.query.o
    let page = req.query.p
    let skip = (page - 1) * 10

    try{
        let getOrders;
        if(order == 'all'){
            getOrders = await orderSchema.find({vendor_id : custId}).populate('product_id').skip(skip).limit(10)
        } else {
            getOrders = await orderSchema.find({vendor_id : custId, vendor_state : order}).populate('product_id').skip(skip).limit(10)
        }

        res.status(200).json({message : getOrders})

    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
}

export async function setAvailable(req,res){
    let id = req.query.id
    let cond = req.query.cond

    try{
        let setavailable;

        if(cond != 'false'){
            setavailable = await orderSchema.findByIdAndUpdate({_id : id},{available : cond, state : 'packaging'}, {new : true}).populate('product_id')
        } else {
            setavailable = await orderSchema.findByIdAndUpdate({_id : id},{available : cond}, {new : true}).populate('product_id')
        }


        res.status(201).json({message : setavailable})

    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
}

export async function packaged(req,res){
    let id = req.query.id

    try{
        let data = await orderSchema.findByIdAndUpdate({_id : id},{state : 'packaged'}, {new : true}).populate('product_id')
        res.status(201).json({message : data})
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
}

export async function cancelOrder(req,res){
    let id = req.query.id

    try{
        let removeOrder = await orderSchema.findByIdAndDelete({_id : id}, {new : true}).populate('product_id')
        res.status(201).json({message : removeOrder})
    }catch(err){
        res.status(500).json({message : err})
    }
}

export async function delivery(req,res){
    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {state : 'on delivery', vendor_state : 'success'}, {new : true}).populate('product_id')
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
}

export async function getDelivery(req,res){
    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {state : 'delivered'}, {new : true}).populate('product_id')
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
}

export async function refundDelivery(req,res){
    let id = req.query.id

    try{
        let delivery = await orderSchema.findByIdAndUpdate({_id : id}, {isRefunded : true}, {new : true}).populate('product_id')
        
        res.status(201).json({message : delivery})
    }catch(err){
        res.status(500).json({message : err})
    }
}