import ProductSchema from "../model/productModel.js";

export async function getAllProducts(req,res) {

    let { pn, cat, p } = req.query
    let regex = new RegExp(pn, 'i');
    let data = JSON.stringify(req.user._id)
    let page = req.query.page || 1
    const skip = (page - 1) * 10;

    let sort = '';

    if (p == 'High - Low') {
        sort = { price: -1 }
    } else if (p == 'Low - High') {
        sort = { price: 1 }
    } else {
        sort = { price: 1 }
    }

    let filter = {
        product_owner: data.slice(1, -1),
        product_name: pn.length < 4 ? { $regex: `^${pn}`, $options: 'i' } : regex,
        category: cat,
    }

    for (let key in filter) {
        if (filter[key] == '' || filter[key] == 'select categories' || filter[key] == 'select price') {
            delete filter[key]
        }
    }

    try {
        let getProducts = await ProductSchema.find(filter).skip(skip).limit(10).sort(sort);
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }

}

export async function getProduct(req,res) {

    let id = req.params.id

    try {
        let getProduct = await ProductSchema.find({ _id: id })

        res.status(200).json({ message: getProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting single product', err })
    }

}