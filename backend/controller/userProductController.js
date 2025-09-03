import productInfo from "../model/productInfoModel.js";
import ProductSchema from "../model/productModel.js";

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
        res.status(200).json({ message: sendArr })
    } catch (err) {
        res.status(500).json({ message: err })
    }

}