import mongoose from "mongoose";

let Schema = new mongoose.Schema({
    product_owner: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_desc: {
        type: String,
        required: true
    },
    product_short_details: [
        {
            input1: {
                type: String,
                required: true
            },
            input2: {
                type: String,
                required: true
            }
        },
    ],
    product_long_details: [
        {
            type: String,
            required: true
        },
    ],
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        image300: {
            type: String,
        },
        image800: {
            type: String
        },
        image1600: {
            type: String
        },
    },
    imageExtraUrl: [
        {
            image800: {
                type: String,
            },
            image1600: {
                type: String,
            },
        },
    ],
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    quantity : {
        type : Number,
        required: true
    }
})

let ProductSchema = new mongoose.model('ProductSchema', Schema)

export default ProductSchema