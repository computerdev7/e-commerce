import ProductSchema from "../model/productModel.js";
import client from "../database/redis.js";

export async function userSearch(req, res) {

    let { q, cat, p } = req.query
    let regex = new RegExp(q, 'i');
    let page = req.query.page || 1;
    let skip = (page - 1) * 10;
    let data = '';

    let filter = {
        product_name: q.length < 4 ? { $regex: `^${q}`, $options: 'i' } : regex,
    }

    if (cat && cat != 'choose category') {
        filter.category = cat
    }

    let sort = p == 'High - Low' ? { price: -1 } : { price: 1 };

    try {

        let defaultPage = (cat == '' || cat == 'choose category') && q == '' && page == 1;

        if (defaultPage) {
            let cacheValue = await client.get('usersearchresult')
            if (cacheValue) {
                let parse = JSON.parse(cacheValue)
                return res.status(200).json({ message: parse })
            }
        }
        
        data = await ProductSchema.find(filter).skip(skip).limit(10).sort(sort);
        
        if(defaultPage){
            let stringify = JSON.stringify(data)
            await client.set('usersearchresult', stringify, { EX: 120 })
        }

        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}

export async function searchSuggestion(req, res) {

    // add category filter to get more personlized serach results
    let q = req.query.q

    try {
        let result = await client.get('result')
        if(result){
            let parse = JSON.parse(result)
            return res.status(200).json({message : parse })
        }

        let data = await ProductSchema.find({ product_name: { $regex: `^${q}`, $options: 'i' } })
        let stringify = JSON.stringify(data)
        await client.set('result',stringify,{EX: 120})
        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}