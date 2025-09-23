import mongoose from "mongoose";

let schema = new mongoose.Schema({
    vendor_id : {
        type : String,
        required : true
    },
    user_id : {
        type : String,
        required : true
    },
    product_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ProductSchema',
        required : true
    },
    state : {
        type : String,
    },
    available : {
        type : Boolean,
    },
    vendor_state : {
        type : String,
        required : true
    },
    user_state : {
        type : String,
        required : true
    },
    isCancelOrder : {
        type: Boolean,
    },
    isRefunded : {
        type : Boolean,
        required : true
    },
    refundfeedback : {
        type : String
    },
    quantity : {
        type : Number,
        required : true
    }
}, {timestamps : true})


let orderSchema = mongoose.model('orderSchema',schema)

export default orderSchema