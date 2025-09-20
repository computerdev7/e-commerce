import productInfo from "../model/productInfoModel.js";
import ProductSchema from "../model/productModel.js";
import client from "../database/redis.js";

export async function getCategories(req, res) {
    try {
        let data = await productInfo.find()
        res.status(200).json({ message: data })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function getAllProducts(req, res) {

    let sendArr = [];

    try {
        let cacheValue = await client.get('result')

        if (cacheValue) {
           
            let parseValue = JSON.parse(cacheValue)
            res.status(200).json({ message: parseValue })
        } else {
           
            let data = await productInfo.find()

            let categoryArray = data[0].product_categories

            for (let i = 0; i < categoryArray.length; i++) {

                let categoryData = await ProductSchema.aggregate([
                    { $match: { category: categoryArray[i] } },
                    { $sample: { size: 10 } }
                ])

                let obj = {
                    [categoryArray[i]]: categoryData
                }

                sendArr.push(obj)

            }

            let stringify = JSON.stringify(sendArr)

            await client.set('result',stringify, {EX : 10})

            res.status(200).json({ message: sendArr })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}

export async function getProduct(req, res) {

    let id = req.query.id

    try {
        let data = await ProductSchema.find({ _id: id })
        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}