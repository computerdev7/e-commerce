import { getPreSignedImageUrl, getDeletePreSignedUrl } from "../utils/presigned_url/getPresignedImageUrl.js";
import ProductSchema from "../model/productModel.js";

export async function addProduct(req, res) {

    let { productname, price, category } = req.body
    let userName = req.user.username
    let sizes = ['300', '800', '1600']

    let image300 = `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${userName}/${productname}300.webp`
    let image800 = `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${userName}/${productname}800.webp`
    let image1600 = `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${userName}/${productname}1600.webp`

    try {

        let addProduct = new ProductSchema({
            product_owner: req.user._id,
            product_name: productname,
            price: price,
            imageUrl: {
                image300,
                image800,
                image1600
            },
            category: category
        })

        let saveProduct = await addProduct.save()

        let presignedArray = [];

        for (let i = 0; i < 3; i++) {
            let sendPostImageUrl = await getPreSignedImageUrl(userName, `${productname}${sizes[i]}.webp`)
            presignedArray.push(sendPostImageUrl)
        }

        res.status(201).json({ message: presignedArray })
    } catch (err) {
        res.status(500).json({ message: 'error in adding product', err })
        console.log(err)
    }


}

export async function deleteProduct(req, res) {

    let { id } = req.params

    try {

        let getProducts = await ProductSchema.findByIdAndDelete({ _id: id })
        await getDeletePreSignedUrl(req.user.username, `${getProducts.product_name}.webp`)
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }

}

export async function updateProduct(req, res) {

    let id = req.body.id

    try {
        let updateProduct = await ProductSchema.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).json({ message: updateProduct })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in updating product', err })
    }

}