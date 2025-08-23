import express from 'express'
import productInfo from '../model/productInfoModel.js'
import checkCookie from '../middleware/checkCookies.js'
import CheckUserType from '../middleware/checkUserType.js'
import ProductSchema from '../model/productModel.js'
import authSchema from "../model/authModel.js"

let route = express.Router()

route.get('/getCategories',checkCookie,CheckUserType('user'),async(req,res)=> {

    try{
        let data = await productInfo.find()
        res.status(200).json({message : data})
    }catch(err){
        res.status(500).json({message : err})
    }

})

route.get('/getAllProducts',checkCookie,CheckUserType('user'),async(req,res)=>{

    let sendArr = [];

    try{
        let data = await productInfo.find()

        let categoryArray = data[0].product_categories
       
        for(let i = 0; i < categoryArray.length ; i++){

            let categoryData = await ProductSchema.aggregate([
                { $match : { category : categoryArray[i] }},
                { $sample: { size: 1 } }
            ])

            let obj = {
                [categoryArray[i]] : categoryData
            }

            sendArr.push(obj)

        }
        res.status(200).json({message : sendArr})
        // let data = await ProductSchema.find
    }catch(err){
        res.status(500).json({message : err})
    }

})


route.post('/addtocart',checkCookie,CheckUserType('user'),async(req,res)=> {

    let id = req.query.id
    let userId = req.user.id

    try{
        let data = await authSchema.findByIdAndUpdate({_id : userId}, {$push : {cart : id}},{new : true})

        res.status(201).json({message : data})
    }catch(err){
        res.status(500).json({message : err})
    }

})

route.get('/cartlist',checkCookie,CheckUserType('user'),async(req,res)=> {

    let userId = req.user.id

    try{
        let data = await authSchema.find({_id : userId}).populate('cart')
        let sendData = data[0].cart
        res.status(200).json({message : sendData})
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }

})

route.delete('/removefromcart',checkCookie,CheckUserType('user'),async(req,res)=> {

    let userId = req.user.id
    let id = req.query.id

    try{
        let data = await authSchema.findByIdAndUpdate({_id : userId},{$pull : {cart : id}},{new : true})

        res.status(200).json({message : data})
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }

})

export default route