import mongoose from "mongoose";

let Schema = new mongoose.Schema({
    product_owner : {
        type : String,
        required : true
    },
    product_name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    }
})

let ProductSchema = new mongoose.model('ProductSchema', Schema)

export default ProductSchema