import mongoose from "mongoose";

let schema = new mongoose.Schema({
    openUse : {
        type : Boolean,
        required : true
    },
    product_categories : [
        {
            type : String,
        },
    ]
})

let productInfo = mongoose.model('productInfo',schema)

export default productInfo