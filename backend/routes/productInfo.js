import express from "express"
import productInfo from "../model/productInfoModel.js"
import checkCookie from "../middleware/checkCookies.js"
import CheckUserType from "../middleware/checkUserType.js"

let route = express.Router()

route.put('/addCategory', checkCookie, CheckUserType('vendor'), async (req, res) => {

    let category = req.body.category

    try {
        let data = await productInfo.findOneAndUpdate({openUse : true}, { $push: { product_categories: category } })

        res.status(201).json({ message: data })
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

route.get('/getCategories', checkCookie, CheckUserType('vendor'), async(req, res) => {

    try {
        let data = await productInfo.find()
        res.status(200).json({message : data})
    } catch (err) {
        res.status(500).json({ message: err })
    }

})

export default route