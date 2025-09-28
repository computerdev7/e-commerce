import ProductSchema from "../model/productModel.js";
import client from "../database/redis.js";

export async function getAllProducts(req, res) {

    let { pn, cat, p, page = 1 } = req.query
    let regex = new RegExp(pn, 'i');
    let data = JSON.stringify(req.user._id)
    const skip = (page - 1) * 10;

    let sort = p == 'High - Low' ? { price: -1 } : { price: 1 };

    let filter = {
        product_owner: data.slice(1, -1),
    }

    if (pn) {
        filter.product_name = pn.length < 4 ? { $regex: `^${pn}`, $options: 'i' } : regex
    }
    if (cat && cat != 'select categories') {
        filter.category = cat
    }

    let defultPage = pn == '' && (p == 'select price' || p == '') && (cat == 'select categories' || cat == '') && page == 1;

    if (defultPage) {
        let cacheValue = await client.get('vendorsearchproducts')
        if (cacheValue) {
            let parse = JSON.parse(cacheValue)
            return res.status(200).json({ message: parse })
        }
    }

    if (pn == '' && (p == 'select price' || p == '') && (cat == 'select categories' || cat == '') && page == 1) {
        let cacheValue = await client.get('vendorsearchproducts')
        if (cacheValue) {
            let parse = JSON.parse(cacheValue)
            return res.status(200).json({ message: parse })
        }
    }
    
    try {

        let getProducts = await ProductSchema.find(filter).skip(skip).limit(10).sort(sort);
        if (defultPage) {
            let stringify = JSON.stringify(getProducts)
            await client.set('vendorsearchproducts', stringify, { EX: 60 })
        }
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }

}

export async function getProduct(req, res) {

    let id = req.params.id

    try {
        let getProduct = await ProductSchema.find({ _id: id })

        res.status(200).json({ message: getProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting single product', err })
    }

}