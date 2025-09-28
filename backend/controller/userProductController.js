import productInfo from "../model/productInfoModel.js";
import ProductSchema from "../model/productModel.js";
import client from "../database/redis.js";

export async function getCategories(req, res) {
    try {
        let cacheValue = await client.get('result')

        if(cacheValue){
            let parseData = JSON.parse(cacheValue)
            return res.status(200).json({ message: parseData })
        }
        let data = await productInfo.find()
        await client.set('result',JSON.stringify(data),{EX : 300})
        res.status(200).json({ message: data })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function getAllProducts(req, res) {

    try {
        let cacheValue = await client.get('result')

        if (cacheValue) {
           
            let parseValue = JSON.parse(cacheValue)
            res.status(200).json({ message: parseValue })
        } else {
           
            let data = await productInfo.find()

            let categoryArray = data[0].product_categories

            let promises = categoryArray.map((cat)=> 
                
                ProductSchema.aggregate([
                    { $match: { category: cat } },
                    { $sample: { size: 10 } }
                ]).then((res)=> ({cat : res }))

            )

            let result = await Promise.all(promises)

            await client.set('result',JSON.stringify(result), {EX : 60})

            res.status(200).json({ message: result })
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