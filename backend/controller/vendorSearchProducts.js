import ProductSchema from "../model/productModel.js";

export async function searchSuggestion(req,res) {

    let q = req.query.q

    try {
        let data = await ProductSchema.find({ product_name: { $regex: `^${q}`, $options: 'i' } })
        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}