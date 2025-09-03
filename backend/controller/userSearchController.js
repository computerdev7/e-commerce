import ProductSchema from "../model/productModel.js";


export async function userSearch(req,res){
    
    let {q,cat,p } = req.query
    let regex = new RegExp(q, 'i');
    let page = req.query.page || 1;
    let skip = (page - 1) * 10;
    let data = '';

    let filter = {
        product_name : {$regex : `^${q}`, $options: 'i'},
        category : cat,
    }

    let filter1 = {
        product_name : regex,
        category : cat,
    }

    for (let key in filter){
        if(filter[key] == '' || filter[key] == 'choose category'){
            delete filter[key]
        }
    }

    for (let key in filter1){
        if(filter1[key] == '' ||  filter[key] == 'choose category'){
            delete filter1[key]
        }
    }

    let sort = '';

    if(p == 'High - Low'){
        sort = {price : -1}
    } else if (p == 'Low - High'){
        sort = {price : 1}
    } else {
        sort = {price : 1}
    }

    try{
         if(q.length < 4){
           
            data = await ProductSchema.find(filter).skip(skip).limit(10).sort(sort);
        } else {
           
            data = await ProductSchema.find(filter1).skip(skip).limit(10).sort(sort);
            console.log(data)
        }

        res.status(200).json({message : data})
    }catch(err){
        res.status(500).json({message : err})
    }

}

export async function searchSuggestion(req,res){

    let q = req.query.q
    
    try{
        let data = await ProductSchema.find({product_name : { $regex : `^${q}`, $options: 'i'}})
        res.status(200).json({message : data })
    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }

}