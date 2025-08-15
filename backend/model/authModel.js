import mongoose from "mongoose";

let schema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String, 
    },
    googleId : {
        type : String
    },
    provider : {
        type : String,
        required : true,
        enum : ['local','google']
    }
},{timestamps : true})

let authSchema = mongoose.model('authSchema',schema)

export default authSchema