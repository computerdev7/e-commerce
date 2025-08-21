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
    },
    imageUrl : {
        image300 : {
            type : String,
            required : true
        },
        image800 : {
            type : String,
            required : true
        },
        image1600 : {
            type : String,
            required : true
        },
    },
    category : {
        type : String,
        required : true
    }
})

let ProductSchema = new mongoose.model('ProductSchema', Schema)

export default ProductSchema