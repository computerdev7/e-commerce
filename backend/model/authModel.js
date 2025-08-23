import mongoose from "mongoose";

let schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String
    },
    provider: {
        type: String,
        enum: ['local', 'google']
    },
    userType: {
        type: String,
        required: true,
        enum: ['user', 'vendor']
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductSchema'
        },
    ]
}, { timestamps: true })

let authSchema = mongoose.model('authSchema', schema)

export default authSchema