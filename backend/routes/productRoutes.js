import express from "express"
import ProductSchema from "../model/productModel.js";
import checkCookie from "../middleware/checkCookies.js";
import CheckUserType from "../middleware/checkUserType.js";

let route = express.Router()

route.post('/addproduct', checkCookie, CheckUserType('vendor'), async (req, res) => {

    let { productname, price } = req.body

    try {

        let addProduct = new ProductSchema({
            product_owner: req.user._id,
            product_name: productname,
            price: price
        })

        let saveProduct = await addProduct.save()

        res.status(201).json({ message: 'succesfully added the product' })
    } catch (err) {
        res.status(500).json({ message: 'error in adding product', err })
        console.log(err)
    }

})

route.get('/getAllProducts', checkCookie, CheckUserType('vendor'), async (req, res) => {

    let data = JSON.stringify(req.user._id)

    try {

        let getProducts = await ProductSchema.find({ product_owner: data.slice(1, -1) })
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }
})

route.delete('/deleteProduct/:id', checkCookie, CheckUserType('vendor'), async (req, res) => {

    let { id } = req.params

    try {

        let getProducts = await ProductSchema.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }
})

route.patch('/updateProduct',checkCookie, CheckUserType('vendor'), async (req, res) => {

    let id = req.body.id

    try {
        let updateProduct = await ProductSchema.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).json({ message: updateProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in updating product', err })
    }

})

route.get('/getProduct/:id',checkCookie, CheckUserType('vendor'), async (req, res) => {

    let id = req.params.id

    try {
        let getProduct = await ProductSchema.find({ _id: id })

        res.status(200).json({ message: getProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting single product', err })
    }

})

export default route