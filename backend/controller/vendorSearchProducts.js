import ProductSchema from "../model/productModel.js";
import client from "../database/redis.js";

export async function searchSuggestion(req,res) {

    let q = req.query.q
    let storeQueryData = await client.get(q);
    
    if(storeQueryData){
        let parse = JSON.parse(storeQueryData)
        return res.status(200).json({ message: parse })
    }

    try {
        let data = await ProductSchema.find({ product_name: { $regex: `^${q}`, $options: 'i' } })
        let conData = JSON.stringify(data)
        await client.set(q, conData, {EX : 120})
        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}